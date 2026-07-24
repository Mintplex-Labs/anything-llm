#!/usr/bin/env python3
"""Perform actions on desktop app UI elements via AT-SPI.

Designed to be invoked as a CLI tool from the pi-dev extension harness.
All commands target elements by matching role + label within a given app.

Usage:
  a11y-action.py <app> click      <label>              # click a button/element
  a11y-action.py <app> set_text   <label> <value>      # set text field contents
  a11y-action.py <app> get_text   <label>              # read text field contents
  a11y-action.py <app> select     <combo_label> <item> # select combo box item
  a11y-action.py <app> focus      <label>              # focus an element
  a11y-action.py <app> key        <keyname>            # send key/hotkey (xdotool syntax)
  a11y-action.py <app> type       <text>               # type via keyboard events
  a11y-action.py <app> scroll     <direction> [amount] # scroll up/down/left/right
  a11y-action.py <app> set_value  <label> <number>     # set slider/spinner value
  a11y-action.py <app> action     <label> <action>     # invoke named AT-SPI action

Returns JSON: {"ok": true, ...} or {"error": "..."}
"""
import gi, sys, json, warnings, subprocess, os

warnings.filterwarnings("ignore", category=DeprecationWarning)
gi.require_version("Atspi", "2.0")
from gi.repository import Atspi


def _normalize(s):
    """Strip spaces, hyphens, underscores for fuzzy matching."""
    return s.lower().replace(" ", "").replace("-", "").replace("_", "")


def _xenv():
    return {
        **os.environ,
        "DISPLAY": ":0",
        "DBUS_SESSION_BUS_ADDRESS": os.environ.get("DBUS_SESSION_BUS_ADDRESS", "unix:path=/run/user/1000/bus"),
    }


def find_app(name):
    desktop = Atspi.get_desktop(0)
    norm = _normalize(name)
    for i in range(desktop.get_child_count()):
        child = desktop.get_child_at_index(i)
        cname = child.get_name() or ""
        if norm in _normalize(cname) or _normalize(cname) in norm:
            return child
    return None


def collect_all(node, results):
    try:
        results.append(node)
        for i in range(node.get_child_count()):
            ch = node.get_child_at_index(i)
            if ch:
                collect_all(ch, results)
    except:
        pass


def find_element(app_node, label, role_filter=None):
    """Find an element by label substring, optionally filtered by role."""
    nodes = []
    collect_all(app_node, nodes)
    label_lower = label.lower()

    # Exact match first, then substring
    for exact in (True, False):
        for n in nodes:
            try:
                name = (n.get_name() or "").strip()
                role = n.get_role_name()
                if role_filter and role not in role_filter:
                    continue
                if exact and name.lower() == label_lower:
                    return n
                if not exact and label_lower in name.lower() and name:
                    return n
            except:
                continue
    return None


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


def read_text(node):
    try:
        nc = Atspi.Text.get_character_count(node)
        if nc > 0:
            return Atspi.Text.get_text(node, 0, nc)
    except:
        pass
    return ""


def find_window_id(app_node):
    """Get X11 window ID for the app via xdotool (class name then title fallback)."""
    app_name = app_node.get_name() or ""
    env = _xenv()
    for strategy in [
        ["xdotool", "search", "--classname", app_name.lower()],
        ["xdotool", "search", "--name", app_name],
    ]:
        try:
            r = subprocess.run(strategy, capture_output=True, text=True, timeout=3, env=env)
            ids = [x for x in r.stdout.strip().split("\n") if x.strip()]
            if ids:
                return ids[-1]  # most recently created window
        except Exception:
            pass
    return None


# ── action implementations ────────────────────────────────────────────────────

def do_click(app_node, label):
    roles = {
        "push button", "toggle button", "button", "check box",
        "radio button", "link", "menu item", "switch",
        "list item", "tab", "page tab",
    }
    el = find_element(app_node, label, roles)
    if not el:
        el = find_element(app_node, label)
    if not el:
        return {"error": f"Element '{label}' not found"}

    try:
        na = Atspi.Action.get_n_actions(el)
        if na > 0:
            target_action = 0
            for i in range(na):
                aname = Atspi.Action.get_action_name(el, i)
                if aname in ("click", "activate", "press"):
                    target_action = i
                    break
            Atspi.Action.do_action(el, target_action)
            action_name = Atspi.Action.get_action_name(el, target_action)
            return {"ok": True, "action": action_name, "label": el.get_name(), "role": el.get_role_name()}
    except Exception as e:
        return {"error": f"Action failed on '{label}': {e}"}

    return {"error": f"Element '{label}' has no actions available"}


def do_set_text(app_node, label, value):
    roles = {"text", "password text", "entry", "spin button"}
    el = find_element(app_node, label, roles)
    if not el:
        el = find_element(app_node, label)
    if not el:
        return {"error": f"Text field '{label}' not found"}

    try:
        ifaces = el.get_interfaces()
        if "EditableText" in ifaces:
            Atspi.EditableText.set_text_contents(el, value)
            readback = read_text(el)
            return {"ok": True, "label": el.get_name(), "value_set": value, "readback": readback}
        else:
            return {"error": f"Element '{label}' is not editable (interfaces: {ifaces})"}
    except Exception as e:
        return {"error": f"set_text failed on '{label}': {e}"}


def do_get_text(app_node, label):
    el = find_element(app_node, label)
    if not el:
        return {"error": f"Element '{label}' not found"}

    text = read_text(el)
    name = el.get_name() or ""
    return {"ok": True, "label": name, "role": el.get_role_name(), "text": text}


def do_select(app_node, combo_label, item_label):
    el = find_element(app_node, combo_label, {"combo box"})
    if not el:
        return {"error": f"Combo box '{combo_label}' not found"}

    children = []
    collect_all(el, children)
    item_lower = item_label.lower()

    for child in children:
        try:
            cname = (child.get_name() or "").strip()
            if not cname:
                for j in range(child.get_child_count()):
                    sub = child.get_child_at_index(j)
                    if sub and sub.get_role_name() == "label":
                        cname = sub.get_name() or ""
                        if cname:
                            break

            if item_lower in cname.lower() and cname:
                na = Atspi.Action.get_n_actions(child)
                if na > 0:
                    Atspi.Action.do_action(child, 0)
                    return {"ok": True, "combo": combo_label, "selected": cname}
        except:
            continue

    return {"error": f"Item '{item_label}' not found in combo box '{combo_label}'"}


def do_focus(app_node, label):
    el = find_element(app_node, label)
    if not el:
        return {"error": f"Element '{label}' not found"}

    try:
        Atspi.Component.grab_focus(el)
        return {"ok": True, "label": el.get_name(), "role": el.get_role_name()}
    except Exception as e:
        return {"error": f"Focus failed on '{label}': {e}"}


def do_key(app_node, keyname):
    """Send a key or hotkey to the app window (xdotool syntax: Return, ctrl+s, alt+F4, etc.)."""
    env = _xenv()
    wid = find_window_id(app_node)
    try:
        if wid:
            subprocess.run(
                ["xdotool", "windowfocus", "--sync", wid, "key", "--clearmodifiers", keyname],
                capture_output=True, timeout=5, env=env, check=True,
            )
        else:
            subprocess.run(
                ["xdotool", "key", "--clearmodifiers", keyname],
                capture_output=True, timeout=5, env=env, check=True,
            )
        return {"ok": True, "key": keyname}
    except subprocess.CalledProcessError as e:
        return {"error": f"key failed: {(e.stderr or b'').decode().strip()}"}
    except Exception as e:
        return {"error": str(e)}


def do_type(app_node, text):
    """Type text via keyboard events — fallback when EditableText is unavailable."""
    env = _xenv()
    wid = find_window_id(app_node)
    try:
        if wid:
            subprocess.run(
                ["xdotool", "windowfocus", "--sync", wid,
                 "type", "--clearmodifiers", "--delay", "20", text],
                capture_output=True, timeout=15, env=env, check=True,
            )
        else:
            subprocess.run(
                ["xdotool", "type", "--clearmodifiers", "--delay", "20", text],
                capture_output=True, timeout=15, env=env, check=True,
            )
        return {"ok": True, "typed": text[:80]}
    except subprocess.CalledProcessError as e:
        return {"error": f"type failed: {(e.stderr or b'').decode().strip()}"}
    except Exception as e:
        return {"error": str(e)}


def do_scroll(app_node, direction, amount=3):
    """Scroll within the app's scroll area using xdotool mouse wheel events."""
    btn_map = {"up": "4", "down": "5", "left": "6", "right": "7"}
    btn = btn_map.get(direction.lower())
    if not btn:
        return {"error": f"Unknown direction '{direction}'. Use: up, down, left, right"}

    # Find the best scroll target: prefer scroll pane / list / text area
    nodes = []
    collect_all(app_node, nodes)
    target_ext = None
    for n in nodes:
        try:
            role = n.get_role_name()
            if role in ("scroll pane", "viewport", "list", "text", "tree", "table"):
                ext = get_extents(n)
                if ext and ext["w"] > 50 and ext["h"] > 50:
                    target_ext = ext
                    break
        except Exception:
            pass

    # Fall back to the app's first top-level window
    if not target_ext:
        try:
            for i in range(app_node.get_child_count()):
                ch = app_node.get_child_at_index(i)
                if ch and ch.get_role_name() in ("frame", "dialog", "window"):
                    target_ext = get_extents(ch)
                    if target_ext:
                        break
        except Exception:
            pass

    if not target_ext:
        return {"error": "Could not find a scrollable area in the app"}

    env = _xenv()
    try:
        for _ in range(int(amount)):
            subprocess.run(
                ["xdotool", "mousemove", str(target_ext["x"]), str(target_ext["y"]),
                 "click", btn],
                capture_output=True, timeout=5, env=env,
            )
        return {"ok": True, "direction": direction, "ticks": int(amount)}
    except Exception as e:
        return {"error": str(e)}


def do_set_value(app_node, label, value):
    """Set the numeric value of a slider or spin button via Atspi.Value."""
    el = find_element(app_node, label, {"slider", "spin button", "scroll bar"})
    if not el:
        el = find_element(app_node, label)
    if not el:
        return {"error": f"Element '{label}' not found"}

    try:
        ifaces = el.get_interfaces()
        if "Value" not in ifaces:
            return {"error": f"Element '{label}' has no Value interface (has: {ifaces})"}
        num = float(value)
        Atspi.Value.set_current_value(el, num)
        readback = Atspi.Value.get_current_value(el)
        return {"ok": True, "label": el.get_name(), "value_set": num, "readback": readback}
    except Exception as e:
        return {"error": str(e)}


def do_action(app_node, label, action_name):
    """Invoke a named AT-SPI action on an element (e.g. expand, collapse, open)."""
    el = find_element(app_node, label)
    if not el:
        return {"error": f"Element '{label}' not found"}

    try:
        na = Atspi.Action.get_n_actions(el)
        if na == 0:
            return {"error": f"Element '{label}' ({el.get_role_name()}) has no AT-SPI actions"}
        for i in range(na):
            aname = (Atspi.Action.get_action_name(el, i) or "").lower()
            if aname == action_name.lower():
                Atspi.Action.do_action(el, i)
                return {"ok": True, "label": el.get_name(), "action": action_name}
        available = [Atspi.Action.get_action_name(el, i) for i in range(na)]
        return {"error": f"Action '{action_name}' not found on '{label}'. Available: {available}"}
    except Exception as e:
        return {"error": str(e)}


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: a11y-action.py <app> <command> [args...]"}))
        sys.exit(1)

    app_name = sys.argv[1]
    command = sys.argv[2]

    Atspi.init()
    app_node = find_app(app_name)
    if not app_node:
        desktop = Atspi.get_desktop(0)
        available = []
        for i in range(desktop.get_child_count()):
            available.append(desktop.get_child_at_index(i).get_name() or "(unnamed)")
        print(json.dumps({"error": f"App '{app_name}' not found", "available": available}))
        sys.exit(1)

    if command == "click":
        if len(sys.argv) < 4:
            print(json.dumps({"error": "Usage: a11y-action.py <app> click <label>"}))
            sys.exit(1)
        result = do_click(app_node, sys.argv[3])
    elif command == "set_text":
        if len(sys.argv) < 5:
            print(json.dumps({"error": "Usage: a11y-action.py <app> set_text <label> <value>"}))
            sys.exit(1)
        result = do_set_text(app_node, sys.argv[3], sys.argv[4])
    elif command == "get_text":
        if len(sys.argv) < 4:
            print(json.dumps({"error": "Usage: a11y-action.py <app> get_text <label>"}))
            sys.exit(1)
        result = do_get_text(app_node, sys.argv[3])
    elif command == "select":
        if len(sys.argv) < 5:
            print(json.dumps({"error": "Usage: a11y-action.py <app> select <combo_label> <item>"}))
            sys.exit(1)
        result = do_select(app_node, sys.argv[3], sys.argv[4])
    elif command == "focus":
        if len(sys.argv) < 4:
            print(json.dumps({"error": "Usage: a11y-action.py <app> focus <label>"}))
            sys.exit(1)
        result = do_focus(app_node, sys.argv[3])
    elif command == "key":
        if len(sys.argv) < 4:
            print(json.dumps({"error": "Usage: a11y-action.py <app> key <keyname>"}))
            sys.exit(1)
        result = do_key(app_node, sys.argv[3])
    elif command == "type":
        if len(sys.argv) < 4:
            print(json.dumps({"error": "Usage: a11y-action.py <app> type <text>"}))
            sys.exit(1)
        result = do_type(app_node, sys.argv[3])
    elif command == "scroll":
        direction = sys.argv[3] if len(sys.argv) > 3 else "down"
        amount = int(sys.argv[4]) if len(sys.argv) > 4 else 3
        result = do_scroll(app_node, direction, amount)
    elif command == "set_value":
        if len(sys.argv) < 5:
            print(json.dumps({"error": "Usage: a11y-action.py <app> set_value <label> <value>"}))
            sys.exit(1)
        result = do_set_value(app_node, sys.argv[3], sys.argv[4])
    elif command == "action":
        if len(sys.argv) < 5:
            print(json.dumps({"error": "Usage: a11y-action.py <app> action <label> <action_name>"}))
            sys.exit(1)
        result = do_action(app_node, sys.argv[3], sys.argv[4])
    else:
        result = {
            "error": (
                f"Unknown command: {command}. "
                "Use: click, set_text, get_text, select, focus, key, type, scroll, set_value, action"
            )
        }

    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
