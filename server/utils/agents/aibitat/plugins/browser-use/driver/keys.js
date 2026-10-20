/** Turns "Enter", "Control+A", "shift + tab", "k" into trusted CDP key events. */

// CDP key definitions. `text` makes Chromium send a char/keypress event too.
const NAMED_KEYS = {
  enter: { key: "Enter", code: "Enter", keyCode: 13, text: "\r" },
  tab: { key: "Tab", code: "Tab", keyCode: 9 },
  escape: { key: "Escape", code: "Escape", keyCode: 27 },
  backspace: { key: "Backspace", code: "Backspace", keyCode: 8 },
  delete: { key: "Delete", code: "Delete", keyCode: 46 },
  insert: { key: "Insert", code: "Insert", keyCode: 45 },
  space: { key: " ", code: "Space", keyCode: 32, text: " " },
  arrowup: { key: "ArrowUp", code: "ArrowUp", keyCode: 38 },
  arrowdown: { key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
  arrowleft: { key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
  arrowright: { key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
  pageup: { key: "PageUp", code: "PageUp", keyCode: 33 },
  pagedown: { key: "PageDown", code: "PageDown", keyCode: 34 },
  home: { key: "Home", code: "Home", keyCode: 36 },
  end: { key: "End", code: "End", keyCode: 35 },
};
for (let n = 1; n <= 12; n++)
  NAMED_KEYS[`f${n}`] = { key: `F${n}`, code: `F${n}`, keyCode: 111 + n };
const KEY_ALIASES = {
  return: "enter",
  esc: "escape",
  del: "delete",
  spacebar: "space",
  up: "arrowup",
  down: "arrowdown",
  left: "arrowleft",
  right: "arrowright",
};
// CDP modifier bits: Alt=1, Ctrl=2, Meta/Command=4, Shift=8.
const ALT = { bit: 1, key: "Alt", code: "AltLeft", keyCode: 18 };
const CONTROL = { bit: 2, key: "Control", code: "ControlLeft", keyCode: 17 };
const META = { bit: 4, key: "Meta", code: "MetaLeft", keyCode: 91 };
const SHIFT = { bit: 8, key: "Shift", code: "ShiftLeft", keyCode: 16 };
const IS_MAC = process.platform === "darwin";
const MODIFIERS = {
  alt: ALT,
  option: ALT,
  control: CONTROL,
  ctrl: CONTROL,
  meta: META,
  cmd: META,
  command: META,
  super: META,
  win: META,
  windows: META,
  shift: SHIFT,
  mod: IS_MAC ? META : CONTROL,
  cmdorctrl: IS_MAC ? META : CONTROL,
  commandorcontrol: IS_MAC ? META : CONTROL,
};
const PUNCTUATION_KEYCODES = {
  ";": 186,
  "=": 187,
  ",": 188,
  "-": 189,
  ".": 190,
  "/": 191,
  "`": 192,
  "[": 219,
  "\\": 220,
  "]": 221,
  "'": 222,
};
// Synthetic key events never reach the macOS text system, so editing shortcuts need their command named.
const MAC_EDIT_COMMANDS = {
  a: "selectAll",
  c: "copy",
  v: "paste",
  x: "cut",
  z: "undo",
};

/**
 * The Input.dispatchKeyEvent calls for one key press: modifiers go down, then the key, then all of
 * it comes back up in reverse.
 * @param {string} input - "Enter", "Control+A", "Shift+Tab", "Meta+K", "k"
 * @returns {{down: Object[], up: Object[]}} events to send, with a short pause between the two lists
 */
function keyEvents(input) {
  const { modifiers, key, commands } = parseKeys(input);
  const def = (k) => ({
    key: k.key,
    code: k.code,
    windowsVirtualKeyCode: k.keyCode,
    nativeVirtualKeyCode: k.keyCode,
  });
  const down = [];
  const up = [];
  let bits = 0;
  for (const mod of modifiers) {
    bits |= mod.bit;
    down.push({ type: "rawKeyDown", modifiers: bits, ...def(mod) });
  }
  // Shortcuts (Control+A) type nothing; plain keys and Shift+key do.
  const text =
    key.text && !(bits & (ALT.bit | CONTROL.bit | META.bit))
      ? key.text
      : undefined;
  down.push({
    type: text ? "keyDown" : "rawKeyDown",
    modifiers: bits,
    ...def(key),
    text,
    unmodifiedText: text,
    ...(commands ? { commands } : {}),
  });
  up.push({ type: "keyUp", modifiers: bits, ...def(key) });
  for (const mod of [...modifiers].reverse()) {
    bits &= ~mod.bit;
    up.push({ type: "keyUp", modifiers: bits, ...def(mod) });
  }
  return { down, up };
}

/** "Control+A" / "shift + tab" / "Enter" / "k" -> CDP key definitions. */
function parseKeys(input) {
  const raw = String(input || "").trim() || "Enter";
  // "+" itself can be the key ("Control++").
  const parts =
    raw === "+"
      ? ["+"]
      : raw.endsWith("++")
        ? [...raw.slice(0, -2).split(/\s*\+\s*/), "+"]
        : raw.split(/\s*\+\s*/);
  const last = parts.pop();
  const modifiers = [];
  for (const part of parts) {
    const mod = MODIFIERS[part.toLowerCase()];
    if (!mod)
      throw new Error(
        `"${part}" in "${raw}" is not a modifier key. Use Control, Shift, Alt or Meta, e.g. "Control+A".`
      );
    if (!modifiers.includes(mod)) modifiers.push(mod);
  }
  const name = last.toLowerCase().replace(/\s+/g, "");
  const loneModifier = MODIFIERS[name];
  if (loneModifier && !modifiers.length)
    return {
      modifiers: [],
      key: {
        key: loneModifier.key,
        code: loneModifier.code,
        keyCode: loneModifier.keyCode,
      },
    };
  let key = NAMED_KEYS[KEY_ALIASES[name] || name];
  if (!key && [...last].length === 1) key = charKey(last, modifiers);
  if (!key)
    throw new Error(
      `"${last}" is not a key press_key knows. Use a key name (Enter, Tab, Escape, ArrowDown, PageDown, F5...), a single character, or a combination like "Control+A".`
    );

  let commands;
  const letter = key.code.startsWith("Key")
    ? key.code.slice(3).toLowerCase()
    : "";
  if (
    IS_MAC &&
    MAC_EDIT_COMMANDS[letter] &&
    (modifiers.includes(META) || modifiers.includes(CONTROL)) &&
    !modifiers.includes(ALT)
  ) {
    // Models write "Control+A" whatever the platform - on a Mac the shortcut is Command+A.
    const i = modifiers.indexOf(CONTROL);
    if (i !== -1 && !modifiers.includes(META)) modifiers[i] = META;
    commands = [
      letter === "z" && modifiers.includes(SHIFT)
        ? "redo"
        : MAC_EDIT_COMMANDS[letter],
    ];
  }
  return { modifiers, key, commands };
}

function charKey(ch, modifiers) {
  if (/^[a-z]$/i.test(ch)) {
    const upper = ch.toUpperCase();
    // A lone "A" types a capital; in a shortcut the letter's case comes from Shift ("Control+A" is key "a").
    const key = modifiers.includes(SHIFT)
      ? upper
      : modifiers.length
        ? upper.toLowerCase()
        : ch;
    return {
      key,
      code: `Key${upper}`,
      keyCode: upper.charCodeAt(0),
      text: key,
    };
  }
  if (/^\d$/.test(ch))
    return { key: ch, code: `Digit${ch}`, keyCode: ch.charCodeAt(0), text: ch };
  return {
    key: ch,
    code: "",
    keyCode: PUNCTUATION_KEYCODES[ch] || 0,
    text: ch,
  };
}

module.exports = { keyEvents };
