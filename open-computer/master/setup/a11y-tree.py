#!/usr/bin/env python3
"""Dump the accessibility tree of running applications.

Usage:
  a11y-tree.py              # list all accessible apps
  a11y-tree.py <app-name>   # dump tree for matching app (substring match)
  a11y-tree.py --depth N    # limit tree depth (default: 5)
"""
import gi, sys, argparse
gi.require_version("Atspi", "2.0")
from gi.repository import Atspi


STATE_NAMES = {}
for _attr in dir(Atspi.StateType):
    _val = getattr(Atspi.StateType, _attr)
    if isinstance(_val, int) and not _attr.startswith("_"):
        STATE_NAMES[_val] = _attr.lower().replace("_", "-")


def dump_node(node, indent=0, max_depth=5):
    if indent > max_depth:
        return
    try:
        name = node.get_name() or ""
        role = node.get_role_name()
        states = []
        state_set = node.get_state_set()
        for s in range(Atspi.StateType.LAST_DEFINED):
            if state_set.contains(s):
                states.append(STATE_NAMES.get(s, str(s)))
        text = ""
        try:
            ifaces = node.get_interfaces()
            if "Text" in ifaces:
                n_chars = node.get_character_count()
                if n_chars > 0:
                    text = node.get_text(0, min(n_chars, 80))
                    if n_chars > 80:
                        text += "..."
        except Exception:
            pass

        prefix = "  " * indent
        line = f"{prefix}[{role}]"
        if name:
            line += f' "{name}"'
        if text and text != name:
            line += f" text={text!r}"
        if states:
            line += f" ({', '.join(states)})"
        print(line)

        for i in range(node.get_child_count()):
            child = node.get_child_at_index(i)
            if child:
                dump_node(child, indent + 1, max_depth)
    except Exception as e:
        print(f"{'  ' * indent}[error: {e}]")


def main():
    parser = argparse.ArgumentParser(description="Dump AT-SPI accessibility tree")
    parser.add_argument("app", nargs="?", help="App name substring to match")
    parser.add_argument("--depth", type=int, default=30, help="Max tree depth")
    args = parser.parse_args()

    Atspi.init()
    desktop = Atspi.get_desktop(0)
    n = desktop.get_child_count()

    if n == 0:
        print("No accessible apps found. Make sure GTK_MODULES=gail:atk-bridge is set.")
        sys.exit(1)

    if not args.app:
        print(f"Accessible apps ({n}):")
        for i in range(n):
            child = desktop.get_child_at_index(i)
            print(f"  {child.get_name() or '(unnamed)'} [{child.get_role_name()}]")
        return

    for i in range(n):
        child = desktop.get_child_at_index(i)
        name = child.get_name() or ""
        if args.app.lower() in name.lower():
            print(f"=== {name} [{child.get_role_name()}] ===")
            dump_node(child, max_depth=args.depth)
            return

    print(f"No app matching '{args.app}' found.")
    print("Available:", ", ".join(
        desktop.get_child_at_index(i).get_name() or "(unnamed)" for i in range(n)
    ))


if __name__ == "__main__":
    main()
