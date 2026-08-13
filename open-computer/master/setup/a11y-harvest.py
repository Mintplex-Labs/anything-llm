#!/usr/bin/env python3
"""Harvest a compact, token-light map of an application's UI via AT-SPI.

Mirrors the structure of browser-harvest.js but for native desktop apps.
Returns JSON with two lists:
  actions — interactive elements (buttons, inputs, combos, etc.) with labels + click coordinates
  texts   — visible text content (labels, headings, status text)

Usage:
  a11y-harvest.py <app-name>           # harvest matching app (substring match)
  a11y-harvest.py                      # list available apps
  a11y-harvest.py <app-name> --pretty  # human-readable output
"""
import gi, sys, argparse, json

gi.require_version("Atspi", "2.0")
from gi.repository import Atspi

INTERACTIVE_ROLES = {
    "push button", "toggle button", "check box", "radio button",
    "combo box", "menu item", "check menu item", "radio menu item",
    "text", "password text", "spin button", "slider", "scroll bar",
    "link", "tab", "page tab", "list item", "tree item",
    "entry", "switch", "button",
}

TEXT_ROLES = {
    "label", "heading", "paragraph", "caption", "static",
    "status bar", "description", "comment",
}

NOISE_ROLES = {
    "panel", "filler", "separator", "redundant object", "unknown",
    "scroll pane", "viewport", "layered pane", "grouping", "section",
    "frame", "dialog", "window", "application", "form",
    "page tab list", "tool bar", "menu bar", "tree", "table",
    "list", "split pane", "image",
}


def get_extents(node):
    try:
        ext = node.get_extents(Atspi.CoordType.SCREEN)
        if ext.width > 0 and ext.height > 0:
            return {
                "x": ext.x + ext.width // 2,
                "y": ext.y + ext.height // 2,
                "w": ext.width,
                "h": ext.height,
            }
    except Exception:
        pass
    return None


def get_text_content(node):
    try:
        ifaces = node.get_interfaces()
        if "Text" in ifaces:
            n_chars = node.get_character_count()
            if n_chars > 0:
                return node.get_text(0, min(n_chars, 300))
    except Exception:
        pass
    return ""


def get_value(node):
    try:
        ifaces = node.get_interfaces()
        if "Value" in ifaces:
            return node.get_current_value()
    except Exception:
        pass
    return None


def find_label_for(node):
    """Look for a label via AT-SPI relations or nearby siblings."""
    try:
        relations = node.get_relation_set()
        for rel in relations:
            if rel.get_relation_type() == Atspi.RelationType.LABELLED_BY:
                target = rel.get_target(0)
                if target:
                    return target.get_name() or get_text_content(target)
    except Exception:
        pass
    try:
        parent = node.get_parent()
        if parent:
            pname = parent.get_name()
            if pname:
                return pname
            idx = node.get_index_in_parent()
            for i in range(idx - 1, max(idx - 3, -1), -1):
                sib = parent.get_child_at_index(i)
                if sib and sib.get_role_name() == "label":
                    lbl = sib.get_name() or get_text_content(sib)
                    if lbl:
                        return lbl
    except Exception:
        pass
    return ""


def collect_all(node, raw_nodes):
    """Hard recurse the entire tree unconditionally. Collect every node."""
    try:
        role = node.get_role_name()
        name = node.get_name() or ""

        state_set = node.get_state_set()
        states = set()
        state_checks = {
            Atspi.StateType.CHECKED: "checked",
            Atspi.StateType.EDITABLE: "editable",
            Atspi.StateType.ENABLED: "enabled",
            Atspi.StateType.EXPANDED: "expanded",
            Atspi.StateType.FOCUSED: "focused",
            Atspi.StateType.SELECTED: "selected",
            Atspi.StateType.SENSITIVE: "sensitive",
            Atspi.StateType.SHOWING: "showing",
            Atspi.StateType.VISIBLE: "visible",
        }
        for st, sname in state_checks.items():
            if state_set.contains(st):
                states.add(sname)

        raw_nodes.append({
            "node": node,
            "role": role,
            "name": name,
            "states": states,
        })

        for i in range(node.get_child_count()):
            child = node.get_child_at_index(i)
            if child:
                collect_all(child, raw_nodes)
    except Exception:
        pass


def classify(raw_nodes):
    """Post-filter collected nodes into actions and texts."""
    actions = []
    texts = []
    aid = 1
    tid = 1
    seen = set()

    for item in raw_nodes:
        role = item["role"]
        name = item["name"]
        states = item["states"]
        node = item["node"]

        if role in INTERACTIVE_ROLES:
            ext = get_extents(node)
            if not ext:
                continue
            dedup_key = (role, name, ext["x"], ext["y"])
            if dedup_key in seen:
                continue
            seen.add(dedup_key)

            label = name
            if not label:
                label = get_text_content(node) or find_label_for(node)
            label = (label or "").strip()[:80]

            entry = {
                "id": aid,
                "role": role,
                "label": label or "(unlabeled)",
                "x": ext["x"],
                "y": ext["y"],
            }

            text_val = get_text_content(node)
            if text_val and text_val != label:
                entry["value"] = text_val[:80]

            val = get_value(node)
            if val is not None:
                entry["value"] = val

            if "checked" in states:
                entry["checked"] = True
            if "focused" in states:
                entry["focused"] = True
            if "editable" in states:
                entry["editable"] = True
            if "expanded" in states:
                entry["expanded"] = True
            if "sensitive" not in states:
                entry["disabled"] = True

            actions.append(entry)
            aid += 1

        elif role in TEXT_ROLES:
            text = name or get_text_content(node)
            text = (text or "").strip()
            if text and len(text) > 1:
                texts.append({"id": tid, "role": role, "text": text[:300]})
                tid += 1

    return actions, texts


def get_window_geometry(app_node):
    try:
        for i in range(app_node.get_child_count()):
            child = app_node.get_child_at_index(i)
            if child and child.get_role_name() in ("frame", "dialog", "window"):
                ext = get_extents(child)
                if ext:
                    return {
                        "title": child.get_name() or "",
                        "x": ext["x"] - ext["w"] // 2,
                        "y": ext["y"] - ext["h"] // 2,
                        "w": ext["w"],
                        "h": ext["h"],
                    }
    except Exception:
        pass
    return None


def main():
    parser = argparse.ArgumentParser(description="Harvest AT-SPI accessibility map")
    parser.add_argument("app", nargs="?", help="App name substring to match")
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON")
    args = parser.parse_args()

    Atspi.init()
    desktop = Atspi.get_desktop(0)
    n = desktop.get_child_count()

    if n == 0:
        print(json.dumps({"error": "No accessible apps. Set GTK_MODULES=gail:atk-bridge"}))
        sys.exit(1)

    if not args.app:
        apps = []
        for i in range(n):
            child = desktop.get_child_at_index(i)
            apps.append(child.get_name() or "(unnamed)")
        print(json.dumps({"apps": apps}))
        return

    target = None
    for i in range(n):
        child = desktop.get_child_at_index(i)
        cname = child.get_name() or ""
        norm_app = args.app.lower().replace(" ", "").replace("-", "").replace("_", "")
        norm_cname = cname.lower().replace(" ", "").replace("-", "").replace("_", "")
        if norm_app in norm_cname or norm_cname in norm_app:
            target = child
            break

    if not target:
        available = [desktop.get_child_at_index(i).get_name() or "(unnamed)" for i in range(n)]
        print(json.dumps({"error": f"No app matching '{args.app}'", "available": available}))
        sys.exit(1)

    raw_nodes = []
    collect_all(target, raw_nodes)
    actions, texts = classify(raw_nodes)

    window = get_window_geometry(target)

    result = {
        "app": target.get_name(),
        "window": window,
        "actions": actions[:150],
        "texts": texts[:100],
    }

    indent = 2 if args.pretty else None
    print(json.dumps(result, indent=indent, ensure_ascii=False))


if __name__ == "__main__":
    main()
