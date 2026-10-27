/**
 * The in-page half of the browser driver, evaluated in an isolated JS world (see Tab#evaluate)
 * so pages can neither see nor tamper with it; element refs live in memory, not DOM attributes.
 * The page becomes a flat, token-light list:
 *   [n] tag (state) "label" -> href     interactive elements, used by click/type/select
 *   [Tn] text...                        text blocks, readable in full with read_page
 *
 * A plain string so no bundler transform can inject helpers into it. Keep identical to the
 * desktop app's electron/main/utils/BrowserUse/pageScript.ts.
 */
const PAGE_SCRIPT = String.raw`
if (!window.__bu) window.__bu = (function () {
  var refs = [];
  var textRefs = [];
  // Links collapsed out of the page state keep their ids so read_page and click still work.
  var hiddenLinks = [];
  // A cross-origin frame snapshotted on its own numbers after the items before it, keeping ids unique.
  var idBase = 0, textBase = 0;
  var INTERACTIVE_TAGS = { A: 1, BUTTON: 1, INPUT: 1, SELECT: 1, TEXTAREA: 1, SUMMARY: 1 };
  var INTERACTIVE_ROLES = { button: 1, link: 1, menuitem: 1, menuitemcheckbox: 1, menuitemradio: 1, tab: 1, checkbox: 1, radio: 1, switch: 1, option: 1, combobox: 1, textbox: 1, searchbox: 1, slider: 1, spinbutton: 1, treeitem: 1 };
  var TEXT_TAGS = { P: 1, H1: 1, H2: 1, H3: 1, H4: 1, H5: 1, H6: 1, LI: 1, TD: 1, TH: 1, BLOCKQUOTE: 1, FIGCAPTION: 1, CAPTION: 1, PRE: 1, DD: 1, DT: 1 };
  var INTERACTIVE_SELECTOR = 'a[href],button,input:not([type=hidden]),select,textarea,[contenteditable="true"],[contenteditable=""],[role=button],[role=link],[role=textbox],[role=searchbox],[role=combobox],[role=menuitem],[role=tab],[role=checkbox],[role=radio],[role=switch]';
  var LEAF_TEXT_TAGS = { DIV: 1, SPAN: 1, SECTION: 1, ARTICLE: 1, STRONG: 1, B: 1, EM: 1, TIME: 1 };
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, SVG: 1, META: 1, LINK: 1, BR: 1, HR: 1, TEMPLATE: 1 };

  function ref(id) {
    return refs[id - 1 - idBase];
  }

  function clean(s, max) {
    s = (s || '').replace(/\s+/g, ' ').trim();
    return max && s.length > max ? s.slice(0, max - 1) + '…' : s;
  }

  // innerText glues inline siblings together ("United$129"); fall back to joining text nodes.
  function textOf(el) {
    var text = el.innerText || '';
    if (/\s/.test(text.trim()) || el.children.length < 2) return text;
    var parts = [], walker = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) { var v = walker.currentNode.nodeValue.trim(); if (v) parts.push(v); }
    return parts.join(' ');
  }

  // Offset of an element's frame relative to the top-level viewport (same-origin iframes only).
  function frameOffset(el) {
    var x = 0, y = 0, win = el.ownerDocument.defaultView;
    while (win && win.frameElement) {
      var r = win.frameElement.getBoundingClientRect();
      x += r.left + (win.frameElement.clientLeft || 0);
      y += r.top + (win.frameElement.clientTop || 0);
      win = win.parent;
    }
    return { x: x, y: y };
  }

  function rectOf(el) {
    var r = el.getBoundingClientRect();
    var o = frameOffset(el);
    return { x: r.left + o.x, y: r.top + o.y, w: r.width, h: r.height };
  }

  function isShown(el) {
    var r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    var s = el.ownerDocument.defaultView.getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.visibility === 'collapse') return false;
    if (hidesChildren(el, s, r)) return false;
    return true;
  }

  // Styled buttons often lay a transparent native control over their label (Amazon's "Add to cart"
  // is an opacity .01 input). Transparent text fields are excluded: they are usually bot traps.
  function transparentControl(el, r) {
    var t = el.tagName;
    if (!(t === 'BUTTON' || t === 'A' || (t === 'INPUT' && /^(submit|button|image|reset|checkbox|radio|file)$/i.test(el.type)))) return false;
    var p = el.parentElement;
    if (!p) return false;
    var pr = p.getBoundingClientRect();
    var ix = Math.max(0, Math.min(r.right, pr.right) - Math.max(r.left, pr.left));
    var iy = Math.max(0, Math.min(r.bottom, pr.bottom) - Math.max(r.top, pr.top));
    if (ix * iy < 0.5 * r.width * r.height) return false;
    return /[\p{L}\p{N}]/u.test(p.textContent || '') || !!p.querySelector('img,svg,i');
  }

  // Hidden in a way that hides everything inside too: transparent, or the screen-reader-only pattern
  // (a 1px box with overflow hidden / clip). Children of these are never visible, whatever their own size.
  function hidesChildren(el, s, r) {
    s = s || el.ownerDocument.defaultView.getComputedStyle(el);
    r = r || el.getBoundingClientRect();
    if (parseFloat(s.opacity) < 0.05 && !transparentControl(el, r)) return true;
    var tiny = r.width <= 2 || r.height <= 2;
    if (tiny && (s.overflow === 'hidden' || s.overflowX === 'hidden' || (s.clip && s.clip !== 'auto'))) return true;
    if (/inset\(\s*50%/.test(s.clipPath || '')) return true;
    return false;
  }

  // Parked outside the screen sideways - skip links and shortcut menus sit at left:-10000px until focused.
  function offscreenSideways(rect, vw) {
    return rect.x + rect.w <= 0 || rect.x >= vw;
  }

  // In-viewport elements whose center is covered by something else (modal, banner) are not actionable.
  function isCovered(el, rect, vw, vh) {
    var cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
    if (cx < 0 || cy < 0 || cx > vw || cy > vh) return false;
    if (el.ownerDocument !== document) return false;
    var top = document.elementFromPoint(cx, cy);
    if (!top) return false;
    while (top && top.shadowRoot && top.shadowRoot.elementFromPoint) {
      var inner = top.shadowRoot.elementFromPoint(cx, cy);
      if (!inner || inner === top) break;
      top = inner;
    }
    if (top === el || el.contains(top) || top.contains(el)) return false;
    var root = top.getRootNode && top.getRootNode();
    if (root && root.host && (root.host === el || el.contains(root.host))) return false;
    var label = el.closest && el.closest('label');
    if (label && (label === top || label.contains(top))) return false;
    return true;
  }

  function isInteractive(el) {
    if (INTERACTIVE_TAGS[el.tagName]) {
      if (el.tagName === 'INPUT' && el.type === 'hidden') return false;
      if (el.tagName === 'A' && !el.hasAttribute('href') && !el.getAttribute('role')) return !!el.onclick;
      return true;
    }
    var role = el.getAttribute('role');
    if (role && INTERACTIVE_ROLES[role]) return true;
    if (el.isContentEditable && (!el.parentElement || !el.parentElement.isContentEditable)) return true;
    if (el.hasAttribute('onclick')) return true;
    var tab = el.getAttribute('tabindex');
    if (tab !== null && tab !== '-1') return true;
    var s = el.ownerDocument.defaultView.getComputedStyle(el);
    if (s.cursor === 'pointer') {
      // Only the outermost pointer element counts, otherwise every child span of a card is "clickable".
      var p = el.parentElement;
      if (p && p.ownerDocument.defaultView.getComputedStyle(p).cursor === 'pointer') return false;
      return true;
    }
    return false;
  }

  function labelOf(el) {
    var doc = el.ownerDocument;
    var label = el.getAttribute('aria-label');
    if (!label && el.getAttribute('aria-labelledby')) {
      label = el.getAttribute('aria-labelledby').split(/\s+/).map(function (id) {
        var n = doc.getElementById(id); return n ? n.innerText : '';
      }).join(' ');
    }
    if (!label && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) {
      if (el.id) {
        var l = doc.querySelector('label[for="' + (window.CSS && CSS.escape ? CSS.escape(el.id) : el.id) + '"]');
        if (l) label = l.innerText;
      }
      if (!label && el.closest('label')) label = el.closest('label').innerText;
      if (!label) label = el.getAttribute('placeholder');
      if (!label && (el.type === 'submit' || el.type === 'button')) label = el.value;
    }
    if (!label && el.tagName !== 'SELECT') label = textOf(el);
    if (!label) label = el.getAttribute('title') || el.getAttribute('alt') || el.getAttribute('name') || '';
    if (!label) {
      var img = el.querySelector && el.querySelector('img[alt],svg[aria-label],[title]');
      if (img) label = img.getAttribute('alt') || img.getAttribute('aria-label') || img.getAttribute('title');
    }
    return clean(label, 80);
  }

  function stateOf(el) {
    var parts = [];
    var tag = el.tagName;
    var role = el.getAttribute('role');
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      var t = tag === 'TEXTAREA' ? 'textarea' : (el.getAttribute('type') || 'text');
      if (tag === 'INPUT') parts.push(t);
      if (t === 'checkbox' || t === 'radio') { if (el.checked) parts.push('checked'); }
      else if (el.value) parts.push(t === 'password' ? 'value=•••' : 'value="' + clean(el.value, 40) + '"');
      var ph = el.getAttribute('placeholder');
      if (ph && !el.value && labelOf(el) !== clean(ph, 80)) parts.push('placeholder="' + clean(ph, 40) + '"');
      if (el.readOnly) parts.push('readonly');
    } else if (tag === 'SELECT') {
      var opt = el.options[el.selectedIndex];
      parts.push('selected="' + clean(opt ? opt.text : '', 40) + '"');
      var opts = [];
      for (var i = 0; i < el.options.length && i < 12; i++) opts.push(clean(el.options[i].text, 30));
      parts.push('options: ' + opts.join(' | ') + (el.options.length > 12 ? ' | …' : ''));
    } else if (role && !INTERACTIVE_TAGS[tag]) {
      parts.push(role);
    }
    var checked = el.getAttribute('aria-checked') || el.getAttribute('aria-selected') || el.getAttribute('aria-pressed');
    if (checked === 'true') parts.push('selected');
    if (el.getAttribute('aria-expanded') === 'true') parts.push('expanded');
    if (el.disabled || el.getAttribute('aria-disabled') === 'true') parts.push('disabled');
    if (el === el.ownerDocument.activeElement) parts.push('focused');
    return parts.join(' ');
  }

  function shortHref(el) {
    if (el.tagName !== 'A' || !el.href || el.href.indexOf('javascript:') === 0) return '';
    var href = el.href;
    try {
      var u = new URL(href);
      if (u.origin === location.origin) href = u.pathname + u.search + u.hash;
    } catch (e) {}
    return clean(href, 90);
  }

  function hasDirectText(el) {
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && /[\p{L}\p{N}$€£¥]/u.test(n.nodeValue)) return true;
    }
    return false;
  }

  // Sign-in walls, bot checks and verification codes. One field proves nothing (a header login box),
  // so signals are scored: a confident wall pauses to ask the user, a weak match only informs the model.
  // Returns null or { kind: 'login'|'captcha'|'verification', wall: boolean, score: number }.
  var LOGIN_PATH = /(^|[\/_-])(log-?in|sign-?in|sign_in|auth|authenticate|sso|oauth2?|authorize|session\/new|ap\/signin)([\/_.?-]|$)/i;
  var LOGIN_HOST = /^(accounts?|login|auth|signin|sso|id|idp|identity)\./i;
  var REDIRECT_PARAM = /[?&](return_?to|redirect(_?ur[il])?|next|continue|returnurl|goto|dest)=/i;
  var SIGN_IN_TEXT = /\b(sign ?in|log ?in|login|welcome back|enter your password|continue with (google|apple|microsoft|email))\b/i;
  var DISMISS_TEXT = /^(×|✕|x|close|not now|maybe later|skip|no thanks|continue as guest|continue without)/i;
  var CAPTCHA_FRAME = 'iframe[src*="recaptcha"],iframe[src*="hcaptcha"],iframe[src*="challenges.cloudflare.com"],iframe[src*="arkoselabs"],iframe[src*="funcaptcha"],iframe[title*="captcha" i]';
  var CHALLENGE_PAGE = '#challenge-form,#cf-challenge-running,#challenge-stage,.cf-turnstile';
  // Bot-management vendors. Any of these on screen means a human has to step in:
  // HUMAN/PerimeterX ("Press & Hold"), DataDome, AWS WAF, GeeTest, Akamai, Imperva/Incapsula, Kasada.
  var BOT_VENDOR = '#px-captcha,[id^="px-captcha"],.px-captcha-container,iframe[src*="px-cdn.net"],iframe[src*="px-cloud.net"],iframe[src*="perimeterx"],iframe[src*="captcha-delivery.com"],iframe[src*="awswaf"],#aws-waf-captcha,awswaf-captcha,.geetest_holder,.geetest_panel,[class^="geetest_"],#sec-if-cpt-container,#sec-cpt-if,iframe[src*="_Incapsula_Resource"],iframe[src*="kasada"]';
  var CAPTCHA_TEXT = /verify (that )?you('| a)re (a )?human|are you a (robot|human)|i'?m not a robot|not a bot|checking (your browser|if the site connection)|press (and|&) hold|slide to (verify|continue|complete)|drag the slider|unusual (traffic|activity)|complete the security check|confirm you('| a)re (a )?human|before we continue|pardon our interruption|access (to this page )?(has been |is )?denied|request unsuccessful/i;
  var OTP_SELECTOR = 'input[autocomplete="one-time-code"],input[name*="otp" i],input[id*="otp" i],input[name*="2fa" i],input[name*="totp" i],input[name*="mfa" i]';
  var OTP_TEXT = /verification code|security code|enter (the|your) code|we (sent|texted|emailed)|two-factor|2-step|one-time (pass)?code|authenticator app/i;
  var USER_SELECTOR = 'input[autocomplete="username"],input[autocomplete="email"],input[type="email"],input[name*="user" i],input[name*="email" i],input[name="login" i],input[id*="login" i]';

  function firstShown(doc, selector) {
    var els = doc.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) if (isShown(els[i])) return els[i];
    return null;
  }

  // The block of UI around a field: its form or dialog, else a few levels up.
  function containerOf(el) {
    var box = el.closest('form,[role=dialog],[aria-modal="true"],dialog');
    if (box) return box;
    box = el;
    for (var i = 0; i < 4 && box.parentElement && box.parentElement !== el.ownerDocument.body; i++) box = box.parentElement;
    return box;
  }

  // How much readable content the page has besides this block (main content only, not header/nav).
  function contentOutside(box) {
    var root = document.querySelector('main,[role=main],article') || document.body;
    if (!root) return 0;
    var total = (root.innerText || '').replace(/\s+/g, ' ').length;
    var inside = box && root.contains(box) ? (box.innerText || '').replace(/\s+/g, ' ').length : 0;
    return Math.max(0, total - inside);
  }

  function coversViewport(box) {
    if (box.ownerDocument !== document) return false;
    var top = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    return !!top && (box === top || box.contains(top));
  }

  function isDismissible(box) {
    var buttons = box.querySelectorAll('button,[role=button],a');
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      var label = clean(b.getAttribute('aria-label') || b.innerText || b.getAttribute('title') || '', 40);
      if (DISMISS_TEXT.test(label) || /close|dismiss/i.test(b.getAttribute('aria-label') || '')) return true;
    }
    return false;
  }

  function viewportShare(box) {
    var r = rectOf(box);
    var w = Math.max(0, Math.min(r.x + r.w, window.innerWidth) - Math.max(r.x, 0));
    var h = Math.max(0, Math.min(r.y + r.h, window.innerHeight) - Math.max(r.y, 0));
    return (w * h) / (window.innerWidth * window.innerHeight);
  }

  // Visible buttons/links that start a sign-in or sign-up.
  function countSignInActions() {
    var count = 0;
    var els = document.querySelectorAll('a,button,[role=button]');
    for (var i = 0; i < els.length && count < 5; i++) {
      var label = clean(els[i].innerText || els[i].getAttribute('aria-label') || '', 40);
      if (/^(sign ?in|log ?in|login|sign ?up|create (an )?account|join( now| today)?)\b/i.test(label) && isShown(els[i])) count++;
    }
    return count;
  }

  // Text of a fixed overlay / dialog sitting over the middle of the screen, if any.
  function overlayText() {
    var el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    for (var i = 0; i < 12 && el && el !== document.body && el !== document.documentElement; i++) {
      var s = window.getComputedStyle(el);
      if (s.position === 'fixed' || el.matches('[role=dialog],[role=alertdialog],[aria-modal="true"],dialog')) return (el.innerText || '').slice(0, 1000);
      el = el.parentElement;
    }
    return '';
  }

  function detectBlocker(hints) {
    hints = hints || {};
    var docs = [document];
    var frames = document.querySelectorAll('iframe');
    for (var f = 0; f < frames.length; f++) {
      try { if (frames[f].contentDocument && isShown(frames[f])) docs.push(frames[f].contentDocument); } catch (e) {}
    }
    var find = function (selector) {
      for (var d = 0; d < docs.length; d++) { var el = firstShown(docs[d], selector); if (el) return el; }
      return null;
    };
    var text = ((document.body && document.body.innerText) || '').slice(0, 5000);
    var urlSignal = LOGIN_PATH.test(location.pathname) || LOGIN_HOST.test(location.hostname) ||
      location.hostname === 'login.microsoftonline.com' || (REDIRECT_PARAM.test(location.search) && LOGIN_PATH.test(location.pathname + location.search));
    var headings = [document.title];
    document.querySelectorAll('h1,h2,legend').forEach(function (h) { if (headings.length < 6 && isShown(h)) headings.push(h.innerText); });
    var headingSignal = headings.some(function (h) { return SIGN_IN_TEXT.test(h || ''); });

    // Bot checks. The invisible reCAPTCHA badge and a captcha at the end of a contact form are not walls,
    // but a vendor challenge or challenge wording in an overlay covering the page always is.
    var captchaScore = 0;
    if (find(CHALLENGE_PAGE) || /^(just a moment|attention required|access denied)/i.test(document.title)) captchaScore += 3;
    if (find(BOT_VENDOR)) captchaScore += 3;
    if (CAPTCHA_TEXT.test(overlayText())) captchaScore += 3;
    else if (CAPTCHA_TEXT.test(text)) captchaScore += 2;
    var captchaFrame = find(CAPTCHA_FRAME);
    if (captchaFrame && !captchaFrame.closest('.grecaptcha-badge')) {
      captchaScore += 1;
      if (coversViewport(containerOf(captchaFrame))) captchaScore += 1;
    }
    if (captchaScore && contentOutside(null) < 500) captchaScore += 1;
    if (captchaScore >= 1) return { kind: 'captcha', wall: captchaScore >= 3, score: captchaScore };

    // Verification codes
    var otp = find(OTP_SELECTOR);
    if (otp) {
      var otpScore = 2 + (OTP_TEXT.test(text) ? 2 : 0) + (contentOutside(containerOf(otp)) < 600 ? 1 : 0);
      return { kind: 'verification', wall: otpScore >= 3, score: otpScore };
    }

    // Sign-in
    var field = find('input[type="password"]') || (urlSignal ? find(USER_SELECTOR) : null);
    // Asked for a page, got bounced to a landing page with only "Sign in / Create account" (x.com/home).
    var bounced = !field && (urlSignal || hints.redirected) && countSignInActions() > 0;
    if (!field && !bounced && !(urlSignal && headingSignal)) return null;
    var box = field ? containerOf(field) : document.body;
    var score = 0;
    if (urlSignal || hints.redirected) score += 2;
    if (headingSignal || SIGN_IN_TEXT.test((box.querySelector('h1,h2,h3,legend') || {}).innerText || '')) score += 1;
    var submit = box.querySelector('button[type=submit],input[type=submit],button');
    if (submit && /sign ?in|log ?in|continue|next/i.test(submit.innerText || submit.value || '')) score += 1;
    if (bounced) score += 1;
    if (field && viewportShare(box) >= 0.12) score += 1;
    var modal = !!field && box !== document.body && (box.matches('[role=dialog],[aria-modal="true"],dialog') || coversViewport(box));
    // A closable sign-in popup over a content page is skippable; on a sign-in URL it is the page.
    if (modal) score += isDismissible(box) && !urlSignal ? -1 : 3;
    var outside = contentOutside(field ? box : null);
    if (outside < 600) score += 2;
    else if (outside > 2000 && !modal) score -= 2;
    return { kind: 'login', wall: score >= 4, score: score };
  }

  // Text worth a [Tn] line. Short text is mostly noise ("Menu"), unless it holds a number (a price is
  // often the answer). Table cells and definition values are kept at any length - they merge into their row.
  var CELL_TAGS = { TD: 1, TH: 1, DD: 1, DT: 1 };
  function keepText(el, text) {
    if (!/[\p{L}\p{N}]/u.test(text)) return false;
    if (CELL_TAGS[el.tagName]) return true;
    if (!TEXT_TAGS[el.tagName] || /^H\d$/.test(el.tagName)) return text.length >= 2;
    return text.length >= 8 || /\d/.test(text);
  }

  // A list item or paragraph that is nothing but its links/buttons ("Books Travel Mystery ..." for a
  // category list): the controls are listed on their own, so the text line would only repeat them.
  function onlyControls(el) {
    if (!el.querySelector(INTERACTIVE_SELECTOR)) return false;
    var walker = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      var node = walker.currentNode, parent = node.parentElement;
      if (!parent || SKIP_TAGS[parent.tagName] || !/[\p{L}\p{N}]/u.test(node.nodeValue)) continue;
      var control = parent.closest(INTERACTIVE_SELECTOR);
      if (!control || control === el || !el.contains(control)) return false;
    }
    return true;
  }

  // Repeated blocks (cards, result rows): an element with a sibling of the same tag and class. Text
  // merges only within a block, so a price or button stays next to its product.
  var CARD_TAGS = { LI: 1, ARTICLE: 1, TR: 1, DIV: 1, SECTION: 1, FIGURE: 1 };
  var CARD_ROLES = { listitem: 1, row: 1, article: 1 };
  function isRepeated(el, cache) {
    if (cache.has(el)) return cache.get(el);
    var repeated = false, parent = el.parentElement, role = el.getAttribute('role');
    var cls = typeof el.className === 'string' ? el.className : '';
    // Plain classless divs are layout, not cards.
    if (parent && (CARD_TAGS[el.tagName] || CARD_ROLES[role]) && (el.tagName !== 'DIV' && el.tagName !== 'SECTION' || cls || role)) {
      var same = 0;
      for (var s = parent.firstElementChild; s && same < 2; s = s.nextElementSibling) {
        if (s.tagName === el.tagName && s.className === el.className) same++;
      }
      repeated = same >= 2;
    }
    cache.set(el, repeated);
    return repeated;
  }

  // Repeated blocks around an element, outermost first.
  function cardChain(el, cache) {
    var chain = [], body = el.ownerDocument.body;
    for (var a = el, depth = 0; a && a !== body && depth < 16; a = a.parentElement, depth++) {
      if (isRepeated(a, cache)) chain.unshift(a);
    }
    return chain;
  }

  function compareKeys(a, b) {
    for (var i = 0; i < a.length && i < b.length; i++) {
      if (a[i][0] !== b[i][0]) return a[i][0] - b[i][0];
      if (a[i][1] !== b[i][1]) return a[i][1] - b[i][1];
    }
    return a.length - b.length;
  }

  // "A Light in the Attic" and "A Light in the ..." are the same link (a card's image and title).
  function sameLabel(a, b) {
    var x = a.toLowerCase().replace(/\s*(\.\.\.|…)$/, ''), y = b.toLowerCase().replace(/\s*(\.\.\.|…)$/, '');
    return !!x && !!y && (x.indexOf(y) === 0 || y.indexOf(x) === 0);
  }

  // A plain link inside a navigation list (site menus, category sidebars, footers) - the kind of list
  // that is repeated on every page of a site. Long ones are collapsed in the page state.
  var NAV_CHROME = 'nav,aside,header,footer,[role=navigation],[role=complementary],[role=banner],[role=contentinfo]';
  var NAV_CLASS = /(^|[\s_-])(nav|navbar|menu|sidebar|side|categor(y|ies)|footer|links)([\s_-]|$)/i;
  function navListOf(el) {
    var list = el.closest('ul,ol,menu,[role=list],[role=menu],[role=menubar],[role=tree]');
    if (!list) return null;
    if (list.closest(NAV_CHROME)) return list;
    for (var a = list, i = 0; a && i < 4; a = a.parentElement, i++) {
      if (NAV_CLASS.test(typeof a.className === 'string' ? a.className : '')) return list;
    }
    return null;
  }

  // The top bar: controls near the top of the document, or in the page's header/navigation landmarks.
  function inPageHeader(el, docY, vh) {
    if (docY < 150) return true;
    return docY < vh && !!el.closest('header,nav,[role=banner],[role=navigation]');
  }

  function snapshot(opts) {
    opts = opts || {};
    var budget = opts.maxChars || 8000;
    var vw = window.innerWidth, vh = window.innerHeight;
    var rangeTop = -0.25 * vh, rangeBottom = (opts.viewports || 2.5) * vh;
    var se = document.scrollingElement || document.documentElement;
    var scrollTop = se.scrollTop;
    var terms = (opts.terms || []).map(function (t) { return String(t).toLowerCase(); }).filter(function (t) { return t.length >= 3; });
    refs = []; textRefs = []; hiddenLinks = [];
    idBase = opts.idBase || 0; textBase = opts.textBase || 0;
    var items = []; // { y, x, el, text?, tag, state, label, href }
    // Top-bar controls scrolled out above the snapshot (cart, menu, search) stay reachable.
    var header = [];
    var below = 0, seen = new Set();

    function visit(root, inText) {
      var children = root.children;
      if (!children) return;
      for (var i = 0; i < children.length; i++) {
        var el = children[i];
        if (SKIP_TAGS[el.tagName]) continue;
        if (el.tagName === 'IFRAME') {
          // Cross-origin frames have no contentDocument here - the driver snapshots those separately.
          try { if (el.contentDocument && el.contentDocument.body && isShown(el)) visit(el.contentDocument.body, false); } catch (e) {}
          continue;
        }
        if (!isShown(el)) {
          // display:contents and zero-size wrappers can still hold visible children.
          if (hidesChildren(el)) continue;
          if (el.children.length) visit(el, inText);
          if (el.shadowRoot) visit(el.shadowRoot, inText);
          continue;
        }
        var rect = rectOf(el);
        if (offscreenSideways(rect, vw)) continue;
        if (rect.y + rect.h < rangeTop) {
          if (header.length < 8 && isInteractive(el) && !seen.has(el) && inPageHeader(el, rect.y + scrollTop, vh) &&
            (INTERACTIVE_TAGS[el.tagName] || el.isContentEditable || !el.querySelector(INTERACTIVE_SELECTOR))) {
            var headerLabel = labelOf(el);
            if (headerLabel) {
              seen.add(el);
              header.push({ el: el, tag: el.tagName.toLowerCase(), label: headerLabel });
              continue;
            }
          }
          if (el.children.length) visit(el, inText);
          continue;
        }
        if (rect.y > rangeBottom) { below += (isInteractive(el) ? 1 : 0) + el.querySelectorAll(INTERACTIVE_SELECTOR).length; continue; }

        if (isInteractive(el) && !seen.has(el)) {
          // A clickable wrapper around real controls (a post composer, a card with links) must not
          // swallow them - list the controls inside instead of one giant element.
          if (!INTERACTIVE_TAGS[el.tagName] && !el.isContentEditable && el.querySelector(INTERACTIVE_SELECTOR)) {
            visit(el, inText);
            if (el.shadowRoot) visit(el.shadowRoot, inText);
            continue;
          }
          var label = labelOf(el);
          var editable = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable;
          if (!label && !editable) { visit(el, inText); if (el.shadowRoot) visit(el.shadowRoot, inText); continue; }
          if (isCovered(el, rect, vw, vh)) continue;
          seen.add(el);
          var tag = el.isContentEditable && !INTERACTIVE_TAGS[el.tagName] ? 'editable' : el.tagName.toLowerCase();
          items.push({ y: rect.y, x: rect.x, el: el, tag: tag, state: stateOf(el), label: label || '', href: shortHref(el) });
          if (el.shadowRoot) visit(el.shadowRoot, true);
          continue;
        }

        if (!inText && (TEXT_TAGS[el.tagName] || (LEAF_TEXT_TAGS[el.tagName] && hasDirectText(el)))) {
          var text = clean(textOf(el), 300);
          if (keepText(el, text) && !onlyControls(el)) {
            items.push({ y: rect.y, x: rect.x, el: el, text: true, body: ' ' + text });
            // Still walk inside so links/buttons in the block get ids, but don't re-capture nested text.
            visit(el, true);
            if (el.shadowRoot) visit(el.shadowRoot, true);
            continue;
          }
        }
        visit(el, inText);
        if (el.shadowRoot) visit(el.shadowRoot, inText);
      }
    }
    visit(document.body || document.documentElement, false);

    // Repeated blocks (cards, rows) around each item. A block only counts when it holds more than one
    // item - a list entry with one link is just a line.
    var repeatCache = new Map(), cardCount = new Map(), rectCache = new Map();
    items.forEach(function (it) {
      it.chain = cardChain(it.el, repeatCache);
      it.chain.forEach(function (c) { cardCount.set(c, (cardCount.get(c) || 0) + 1); });
    });
    var keyOf = function (r) { return [Math.round(r.y / 12), Math.round(r.x)]; };
    items.forEach(function (it) {
      it.chain = it.chain.filter(function (c) { return cardCount.get(c) >= 2; });
      it.card = it.chain.length ? it.chain[it.chain.length - 1] : null;
      it.key = it.chain.map(function (c) {
        if (!rectCache.has(c)) rectCache.set(c, keyOf(rectOf(c)));
        return rectCache.get(c);
      }).concat([keyOf(it)]);
    });
    // Reading order: rows top to bottom, then left to right - a block as a whole, then its own items.
    items.sort(function (a, b) { return compareKeys(a.key, b.key); });

    // The same link twice in a row (a card's image and its title): keep one, with the longer label.
    var recent = [];
    items.forEach(function (it) {
      if (it.text || it.tag !== 'a' || !it.href) return;
      for (var r = recent.length - 1; r >= 0; r--) {
        var p = recent[r];
        if (p.card === it.card && p.href === it.href && sameLabel(p.label, it.label)) {
          if (it.label.length > p.label.length) p.label = it.label;
          it.drop = true;
          return;
        }
      }
      recent.push(it);
      if (recent.length > 4) recent.shift();
    });

    // Long navigation lists (a sidebar of 50 categories) would fill the page state on every step.
    // Show the first few and every link that mentions the task; the rest keep their ids for read_page.
    var navLists = new Map();
    items.forEach(function (it) {
      if (it.drop || it.text || it.tag !== 'a' || it.card || it.state) return;
      var list = navListOf(it.el);
      if (!list) return;
      if (!navLists.has(list)) navLists.set(list, []);
      navLists.get(list).push(it);
    });
    navLists.forEach(function (links) {
      if (links.length <= 12) return;
      var shown = 0, last = null;
      links.forEach(function (it, i) {
        var label = it.label.toLowerCase();
        var wanted = terms.some(function (t) { return label.indexOf(t) !== -1; }) || it.el.getAttribute('aria-current');
        if (i < 6 || wanted) { shown++; last = it; } else it.hidden = true;
      });
      if (last) last.after = '(' + (links.length - shown) + ' more links in this list - read_page lists them with ids)';
    });

    // Text of one block on the same row merges into one line ("United · 7:05 AM · $238"). The char
    // budget truncates from the bottom of the page.
    var lines = [], lineY = [], used = 0, dropped = 0, prev = null;
    if (header.length) {
      var parts = header.map(function (h) {
        refs.push(h.el);
        return '[' + (idBase + refs.length) + '] ' + h.tag + ' "' + h.label + '"';
      });
      var headerLine = 'Page header (scrolled out of view): ' + parts.join(' · ');
      lines.push(headerLine);
      lineY.push(-1e9);
      used += headerLine.length + 1;
    }
    for (var k = 0; k < items.length; k++) {
      var item = items[k];
      if (item.drop || item.hidden) continue;
      if (!item.text) item.body = ' ' + item.tag + (item.state ? ' (' + item.state + ')' : '') + ' "' + item.label + '"' + (item.href ? ' -> ' + item.href : '');
      if (item.text && prev && prev.text && prev.card === item.card && Math.abs(item.y - prev.y) < 12 && prev.length + item.body.length < 300) {
        var merged = lines[lines.length - 1] + ' ·' + item.body;
        if (used + item.body.length + 3 > budget) { dropped++; continue; }
        used += merged.length - lines[lines.length - 1].length;
        lines[lines.length - 1] = merged;
        textRefs[textRefs.length - 1].push(item.el);
        prev.length += item.body.length;
        continue;
      }
      if (used + item.body.length + 8 > budget) { dropped++; prev = null; continue; }
      if (item.text) textRefs.push([item.el]);
      else refs.push(item.el);
      var line = '[' + (item.text ? 'T' + (textBase + textRefs.length) : idBase + refs.length) + ']' + item.body;
      lines.push(line);
      lineY.push(Math.round(item.y));
      used += line.length + 1;
      prev = { text: !!item.text, y: item.y, length: item.body.length, card: item.card };
      if (item.after) {
        lines.push(item.after);
        lineY.push(Math.round(item.y));
        used += item.after.length + 1;
        prev = null;
      }
    }
    // Collapsed links are numbered last, so the ids in the page state stay in reading order.
    items.forEach(function (it) {
      if (!it.hidden) return;
      refs.push(it.el);
      hiddenLinks.push('[' + (idBase + refs.length) + '] ' + it.label);
    });
    var maxY = Math.max(0, se.scrollHeight - vh);
    return {
      url: location.href,
      title: document.title,
      scrollY: Math.round(se.scrollTop),
      maxScrollY: Math.round(maxY),
      lines: lines,
      lineY: lineY,
      used: used,
      count: refs.length,
      textCount: textRefs.length,
      truncated: dropped,
      belowFold: below,
      blocker: detectBlocker(opts.hints),
    };
  }

  // Scrolls the element into view and returns its center in viewport coordinates.
  function locate(id) {
    var el = ref(id);
    if (!el || !el.isConnected) return { error: 'Element [' + id + '] no longer exists on the page. Use the latest page state.' };
    el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
    var r = rectOf(el);
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    if (cx < 0 || cy < 0 || cx > window.innerWidth || cy > window.innerHeight)
      return { error: '[' + id + '] is hidden off-screen, so it cannot be clicked. Use a visible element from the latest page state.' };
    return {
      x: Math.round(r.x + r.w / 2),
      y: Math.round(r.y + r.h / 2),
      tag: el.tagName.toLowerCase(),
      label: labelOf(el),
      editable: el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable,
      isSelect: el.tagName === 'SELECT',
    };
  }

  function isEditable(el) {
    if (!el) return false;
    if (el.tagName === 'TEXTAREA') return !el.disabled && !el.readOnly;
    if (el.tagName === 'INPUT') return !el.disabled && !el.readOnly && !/^(button|submit|reset|checkbox|radio|file|image|hidden|range|color)$/i.test(el.type);
    return !!el.isContentEditable;
  }

  // The element that really has keyboard focus, through shadow roots and same-origin iframes.
  function focusedElement() {
    var el = document.activeElement;
    for (var i = 0; i < 10 && el; i++) {
      if (el.shadowRoot && el.shadowRoot.activeElement) el = el.shadowRoot.activeElement;
      else if (el.tagName === 'IFRAME') {
        try { el = el.contentDocument.activeElement; } catch (e) { break; }
      } else break;
    }
    return el;
  }

  // Only focus the target when it is a text field. Clicking a "Start a post" button often moves
  // focus into the editor it opens - refocusing the button would throw the keystrokes away.
  function prepareType(id, clear) {
    var el = id ? ref(id) : null;
    if (id && (!el || !el.isConnected)) return { error: 'Element [' + id + '] no longer exists on the page.' };
    if (el && isEditable(el) && focusedElement() !== el) el.focus();
    var target = focusedElement();
    if (!isEditable(target)) return { error: (el ? '[' + id + '] is ' + describe(el) + ', not a text field.' : 'No text field has focus.') + ' ' + textFieldHint() };
    if (clear) {
      if (typeof target.select === 'function' && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) target.select();
      else if (target.isContentEditable) target.ownerDocument.execCommand('selectAll');
    }
    return { ok: true };
  }

  function describe(el) {
    var tag = el.isContentEditable ? 'an editor' : el.tagName === 'A' ? 'a link' : el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' ? 'a button' : 'a ' + el.tagName.toLowerCase();
    var label = labelOf(el);
    return tag + (label ? ' "' + label + '"' : '');
  }

  // Small models pick the wrong id for text fields a lot - tell them which ids actually take text.
  function textFieldHint() {
    var fields = [];
    for (var i = 0; i < refs.length && fields.length < 8; i++) {
      if (refs[i] && refs[i].isConnected && isEditable(refs[i])) fields.push('[' + (idBase + i + 1) + '] "' + (labelOf(refs[i]) || refs[i].tagName.toLowerCase()) + '"');
    }
    return fields.length
      ? 'Text fields on this page: ' + fields.join(', ') + '.'
      : 'There are no text fields in the latest page state - click the button that opens the field or editor first.';
  }

  // Did the text actually land? Read the focused field back instead of trusting the keystrokes.
  function typedInto(id, text) {
    var target = focusedElement();
    if (!isEditable(target)) return { ok: false, reason: 'no text field has focus anymore' };
    var value = target.isContentEditable ? target.innerText : target.value;
    var want = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    var got = String(value || '').replace(/\s+/g, ' ');
    var el = id ? ref(id) : null;
    var other = el && el !== target && !el.contains(target);
    return {
      ok: !want || got.indexOf(want) !== -1,
      password: target.type === 'password',
      value: target.type === 'password' ? '•••' : clean(value, 80),
      field: other ? labelOf(target) || target.tagName.toLowerCase() : null,
      reason: 'the field does not contain the text',
    };
  }

  // What "scroll" should move: the element's scrollable ancestor, else the window, else the largest
  // scrolling panel (e.g. Zillow's results list, where the middle of the screen is a map).
  var scrollEl = null;
  function canScroll(el) {
    if (!el || el === document.body || el === document.documentElement) return false;
    var s = window.getComputedStyle(el);
    return /(auto|scroll|overlay)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 40;
  }
  function scrollTarget(id) {
    scrollEl = null;
    var el = id ? ref(id) : null;
    for (var a = el; a && !scrollEl; a = a.parentElement) if (canScroll(a)) scrollEl = a;
    var se = document.scrollingElement || document.documentElement;
    if (!scrollEl && se.scrollHeight <= window.innerHeight + 40) {
      var best = 0, all = document.querySelectorAll('body *');
      for (var i = 0; i < all.length; i++) {
        if (!canScroll(all[i]) || !isShown(all[i])) continue;
        var r = all[i].getBoundingClientRect();
        var area = Math.max(0, Math.min(r.right, window.innerWidth) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
        if (area > best) { best = area; scrollEl = all[i]; }
      }
    }
    var box = scrollEl ? scrollEl.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    return { x: Math.round(box.left + box.width / 2), y: Math.round(box.top + Math.min(box.height, window.innerHeight) / 2), panel: scrollEl ? clean(scrollEl.getAttribute('aria-label') || 'side', 40) : null, pos: scrollPos(), max: scrollMax() };
  }
  function scrollMax() {
    if (scrollEl) return Math.max(0, Math.round(scrollEl.scrollHeight - scrollEl.clientHeight));
    var se = document.scrollingElement || document.documentElement;
    return Math.max(0, Math.round(se.scrollHeight - window.innerHeight));
  }
  function scrollPos() {
    return Math.round(scrollEl ? scrollEl.scrollTop : (document.scrollingElement || document.documentElement).scrollTop);
  }
  function scrollByJs(delta) {
    if (scrollEl) scrollEl.scrollBy(0, delta);
    else window.scrollBy(0, delta);
    return scrollPos();
  }

  // Keyboard focus sits inside a cross-origin iframe, which this world cannot look into.
  function focusInFrame() {
    var el = focusedElement();
    return !!el && (el.tagName === 'IFRAME' || el.tagName === 'FRAME');
  }

  // This frame has the keyboard focus, on a text field.
  function hasFocusedField() {
    return document.hasFocus() && isEditable(focusedElement());
  }

  // Signature of the page, to tell when an action changed nothing. Text is hashed too: "Add to cart"
  // -> "Remove" can leave the markup the same size.
  function fingerprint() {
    var active = focusedElement();
    var text = document.body ? document.body.innerText || '' : '';
    var hash = 5381;
    for (var i = 0; i < text.length; i++) hash = ((hash * 33) ^ text.charCodeAt(i)) | 0;
    return location.href + '|' + domSize() + '|' + hash + '|' + (active ? active.tagName + (active.id || '') : '');
  }

  // An element's label and state, to report how a click changed it. Frameworks often swap the clicked
  // button for a new element, so the control now at (x, y) in this frame stands in for it.
  function elementState(id, x, y) {
    var el = ref(id);
    if (!el || !el.isConnected) {
      if (x === undefined || !el) return null;
      var hit = document.elementFromPoint(x, y);
      el = hit && hit.closest(INTERACTIVE_SELECTOR);
      if (!el || el.tagName !== (ref(id) || {}).tagName) return null;
    }
    return { label: labelOf(el), state: stateOf(el).split(' ').filter(function (s) { return s && s !== 'focused'; }).join(' ') };
  }

  function selectOption(id, option) {
    var el = ref(id);
    if (!el || el.tagName !== 'SELECT') return { error: 'Element [' + id + '] is not a dropdown (select). Click it instead.' };
    var want = String(option).toLowerCase().trim();
    var match = null;
    for (var i = 0; i < el.options.length; i++) {
      var o = el.options[i];
      if (o.text.toLowerCase().trim() === want || o.value.toLowerCase() === want) { match = o; break; }
    }
    if (!match) for (var j = 0; j < el.options.length; j++) {
      if (el.options[j].text.toLowerCase().indexOf(want) !== -1) { match = el.options[j]; break; }
    }
    if (!match) return { error: 'No option matching "' + option + '". Options: ' + Array.prototype.map.call(el.options, function (o) { return clean(o.text, 30); }).slice(0, 30).join(' | ') };
    el.value = match.value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return { ok: true, selected: clean(match.text, 40) };
  }

  function read(ids, maxChars) {
    maxChars = maxChars || 6000;
    var out = [];
    if (ids && ids.length) {
      for (var i = 0; i < ids.length && i < 80; i++) {
        var group = (textRefs[ids[i] - 1 - textBase] || []).filter(function (el) { return el.isConnected; });
        out.push('[T' + ids[i] + '] ' + (group.length ? clean(group.map(textOf).join(' · '), maxChars) : '(not on page anymore)'));
      }
    } else {
      var main = document.querySelector('main, [role=main], article') || document.body;
      // Links collapsed out of the page state come first, so the truncation never cuts them off.
      var links = hiddenLinks.join(' · ');
      if (links) links = 'Links not listed in the page state (click them by id): ' + clean(links, Math.round(maxChars / 3));
      var body = (main.innerText || '').replace(/\n{3,}/g, '\n\n').trim();
      var room = maxChars - links.length - 2;
      out.push((body.length > room ? body.slice(0, room) + '\n…(truncated)' : body) + (links ? '\n\n' + links : ''));
      return out.join('\n\n');
    }
    var text = out.join('\n\n');
    return text.length > maxChars ? text.slice(0, maxChars) + '\n…(truncated)' : text;
  }

  /**
   * Find text on the page, like Ctrl+F: snippets around each match and the first match scrolled into
   * view. Words are matched in order with anything short in between, so "strict added" finds
   * "strict argument. Added". Long reference pages are answered without reading them top to bottom.
   */
  function find(query, maxChars, terms) {
    maxChars = maxChars || 3000;
    terms = terms || [];
    var words = String(query || '').toLowerCase().match(/[\p{L}\p{N}_.()-]+/gu) || [];
    if (!words.length) return { error: 'Nothing to find.' };
    var escape = function (w) { return w.replace(/[.*+?^$(){}|[\]\\]/g, '\\' + '$&'); };
    var pattern = new RegExp(words.map(escape).join('[\\s\\S]{0,80}?'), 'gi');
    var text = (document.body && document.body.innerText) || '';
    var hits = [], m, last = -1;
    while ((m = pattern.exec(text)) && hits.length < 50) {
      if (m.index === pattern.lastIndex) pattern.lastIndex++;
      hits.push(m.index);
    }
    if (!hits.length) return { count: 0, text: '' };
    var snippets = [];
    for (var i = 0; i < hits.length; i++) {
      var start = Math.max(0, hits[i] - 200);
      if (start <= last) continue; // overlaps the previous snippet
      var end = Math.min(text.length, hits[i] + 400);
      last = end;
      var s = clean(text.slice(start, end));
      var lower = s.toLowerCase();
      // Snippets that also mention the task come first - a common word matches all over a long page.
      var score = terms.filter(function (t) { return lower.indexOf(t) !== -1; }).length;
      snippets.push({ at: i, score: score, text: (start > 0 ? '…' : '') + s + (end < text.length ? '…' : '') });
    }
    snippets.sort(function (a, b) { return b.score - a.score || a.at - b.at; });
    var shown = [], used = 0;
    for (var k = 0; k < snippets.length && used < maxChars; k++) {
      shown.push(snippets[k].text);
      used += snippets[k].text.length;
    }
    var first = words[0];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.toLowerCase().indexOf(first) === -1) continue;
      var el = node.parentElement;
      if (el && el.getClientRects().length) { el.scrollIntoView({ block: 'center', behavior: 'instant' }); break; }
    }
    var note = shown.length < snippets.length ? '\n\n(' + shown.length + ' of ' + snippets.length + ' matches shown, most related to the task first - search for more specific words to narrow it down)' : '';
    return { count: hits.length, text: shown.join('\n\n') + note };
  }

  function favicon() {
    var l = document.querySelector('link[rel~="icon"]');
    try { return l ? new URL(l.getAttribute('href'), location.href).href : location.origin + '/favicon.ico'; } catch (e) { return ''; }
  }

  function domSize() {
    return document.body ? document.body.innerHTML.length : 0;
  }

  return { snapshot: snapshot, locate: locate, prepareType: prepareType, typedInto: typedInto, textFieldHint: textFieldHint, scrollTarget: scrollTarget, scrollPos: scrollPos, scrollMax: scrollMax, scrollByJs: scrollByJs, fingerprint: fingerprint, elementState: elementState, focusInFrame: focusInFrame, hasFocusedField: hasFocusedField, selectOption: selectOption, read: read, find: find, favicon: favicon, domSize: domSize };
})();
`;

/**
 * Turns passkeys (WebAuthn) off before any page script runs. Chromium hands passkey requests to the
 * OS, which on Windows pops a Windows Hello dialog on sites that ask on load (Google, GitHub).
 * Requests fail with NotAllowedError and no passkey support is reported, so sites fall back to passwords.
 */
const PASSKEY_BLOCK_SCRIPT = String.raw`
(function () {
  try {
    var deny = function () { return Promise.reject(new DOMException('Passkeys are turned off in this browser.', 'NotAllowedError')); };
    if (navigator.credentials) {
      var get = navigator.credentials.get.bind(navigator.credentials);
      var create = navigator.credentials.create.bind(navigator.credentials);
      navigator.credentials.get = function (options) { return options && options.publicKey ? deny() : get(options); };
      navigator.credentials.create = function (options) { return options && options.publicKey ? deny() : create(options); };
    }
    if (window.PublicKeyCredential) {
      var no = function () { return Promise.resolve(false); };
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable = no;
      PublicKeyCredential.isConditionalMediationAvailable = no;
      if (PublicKeyCredential.getClientCapabilities) PublicKeyCredential.getClientCapabilities = function () { return Promise.resolve({}); };
    }
  } catch (e) {}
})();
`;

module.exports = { PAGE_SCRIPT, PASSKEY_BLOCK_SCRIPT };
