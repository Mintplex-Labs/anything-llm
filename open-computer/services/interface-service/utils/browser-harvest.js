// Injected into page context via CDP Runtime.evaluate
// Returns a compact, token-light flat-map of visible interactive elements and text
// This runs INSIDE V8 on the page — must be a self-contained IIFE

(function() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const actions = [];
  const texts = [];
  let aid = 1;
  let tid = 1;

  const INTERACTIVE_TAGS = new Set(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'DETAILS', 'SUMMARY']);
  const INTERACTIVE_ROLES = new Set(['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio', 'switch', 'option', 'combobox', 'textbox', 'searchbox']);
  const TEXT_TAGS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'TH', 'LABEL', 'BLOCKQUOTE', 'FIGCAPTION', 'ARTICLE', 'CAPTION', 'PRE', 'DD', 'DT']);
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'META', 'LINK', 'BR', 'HR']);

  function isVisible(el) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) return false;
    const s = window.getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') return false;
    return true;
  }

  function getLabel(el) {
    // Priority: aria-label > innerText > placeholder > title > alt > name
    return (
      el.getAttribute('aria-label') ||
      el.innerText?.trim().slice(0, 80) ||
      el.getAttribute('placeholder') ||
      el.getAttribute('title') ||
      el.getAttribute('alt') ||
      el.getAttribute('name') ||
      ''
    ).replace(/\s+/g, ' ').trim();
  }

  function isInteractive(el) {
    if (INTERACTIVE_TAGS.has(el.tagName)) return true;
    const role = el.getAttribute('role');
    if (role && INTERACTIVE_ROLES.has(role)) return true;
    if (el.onclick || el.hasAttribute('onclick')) return true;
    if (el.getAttribute('tabindex') && el.getAttribute('tabindex') !== '-1') return true;
    if (el.__custom_listeners) return true;
    // Check cursor style as heuristic for clickable divs
    const cursor = window.getComputedStyle(el).cursor;
    if (cursor === 'pointer') return true;
    return false;
  }

  function getInputState(el) {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const t = el.getAttribute('type') || 'text';
      const v = el.value || '';
      const checked = el.checked;
      let state = `type=${t}`;
      if (v) state += ` value="${v.slice(0, 40)}"`;
      if (checked) state += ' checked';
      if (el.disabled) state += ' disabled';
      if (el === document.activeElement) state += ' focused';
      return state;
    }
    if (el.tagName === 'SELECT') {
      const selected = el.options[el.selectedIndex]?.text || '';
      return `selected="${selected.slice(0, 40)}"`;
    }
    return '';
  }

  function walk(root) {
    const children = root.children;
    if (!children) return;

    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      if (SKIP_TAGS.has(el.tagName)) continue;
      if (!isVisible(el)) continue;

      if (isInteractive(el)) {
        if (el.hasAttribute('data-harvest-id')) continue; // already captured
        const r = el.getBoundingClientRect();
        const label = getLabel(el);
        if (!label && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
          walk(el);
          continue;
        }
        const entry = {
          id: aid,
          tag: el.tagName.toLowerCase(),
          label: label || '(empty)',
          x: Math.round(r.left + r.width / 2),
          y: Math.round(r.top + r.height / 2),
        };
        if (el.tagName === 'A' && el.href) entry.href = el.href;
        const inputState = getInputState(el);
        if (inputState) entry.state = inputState;
        actions.push(entry);
        // Mark element so we can find it later for interaction
        el.setAttribute('data-harvest-id', String(aid));
        aid++;
        // Don't recurse into interactive elements (avoid double-counting children)
        continue;
      }

      // Check if it's a meaningful text container (allow mixed content like spans/links inside)
      if (TEXT_TAGS.has(el.tagName)) {
        if (el.hasAttribute('data-harvest-tid')) continue; // already captured
        const text = el.innerText?.trim();
        if (text && text.length > 10) {
          texts.push({ id: tid, tag: el.tagName.toLowerCase(), text: text.slice(0, 300) });
          el.setAttribute('data-harvest-tid', String(tid));
          tid++;
          if (!el.querySelector('a,button,input,select,textarea,details,summary,[role],[onclick],[tabindex]')) {
            continue;
          }
        }
      }

      walk(el);
    }
  }

  // Walk shadow roots if accessible
  function walkWithShadow(root) {
    walk(root);
    const allEls = root.querySelectorAll('*');
    for (const el of allEls) {
      if (el.shadowRoot) {
        walk(el.shadowRoot);
      }
    }
  }

  // Clear previous harvest markers so re-runs work correctly
  document.querySelectorAll('[data-harvest-id]').forEach(el => el.removeAttribute('data-harvest-id'));
  document.querySelectorAll('[data-harvest-tid]').forEach(el => el.removeAttribute('data-harvest-tid'));

  // Auto-scroll to capture below-fold content (up to 5 viewports)
  const origScrollY = window.scrollY;
  const maxScrolls = 5;
  const scrollStep = Math.round(vh * 0.8);

  for (let i = 0; i <= maxScrolls; i++) {
    if (i > 0) {
      window.scrollTo(0, i * scrollStep);
      // Allow layout to settle
    }
    walkWithShadow(document.body);

    // Stop if we've scrolled past the end
    if (window.scrollY + vh >= document.body.scrollHeight) break;
  }

  // Restore original scroll position
  window.scrollTo(0, origScrollY);

  return JSON.stringify({
    url: location.href,
    title: document.title,
    scroll: { x: window.scrollX, y: origScrollY, maxY: document.body.scrollHeight - vh },
    viewport: { w: vw, h: vh },
    actions: actions.slice(0, 150),
    texts: texts.slice(0, 100),
  });
})()
