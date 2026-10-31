// Small progressive enhancements. Everything reads fine without JS.
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Theme toggle: system preference by default, the visitor's choice remembered.
  var btn = document.querySelector(".theme-toggle");
  var darkMQ = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function current() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return darkMQ && darkMQ.matches ? "dark" : "light";
  }
  function sync() {
    var dark = current() === "dark";
    if (btn) btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    var meta = document.querySelectorAll('meta[name="theme-color"]');
    meta.forEach(function (m) { m.setAttribute("content", dark ? "#121110" : "#f5f1e8"); });
  }
  if (btn) {
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      sync();
    });
  }
  if (darkMQ && darkMQ.addEventListener) darkMQ.addEventListener("change", sync);
  sync();

  // Reveal blocks as they scroll into view.
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Type out the whoami answer once.
  var typed = document.querySelector(".typed");
  if (typed && !reduce) {
    var full = typed.textContent;
    typed.setAttribute("aria-label", full);
    typed.textContent = "";
    var i = 0;
    setTimeout(function step() {
      typed.textContent = full.slice(0, ++i);
      if (i < full.length) setTimeout(step, 36);
    }, 800);
  }

  // The typing-test keyboard types "سنڌي ٻولي" on a loop while it is on screen.
  var kbd = document.querySelector(".kbd");
  if (kbd && !reduce) {
    var out = kbd.querySelector(".kbd-typed");
    var word = ["س", "ن", "ڌ", "ي", " ", "ٻ", "و", "ل", "ي"];
    var keys = {};
    kbd.querySelectorAll(".kbd-row span").forEach(function (k) { keys[k.textContent] = k; });
    var n = 0, timer = null;
    function tick() {
      if (n >= word.length) { n = 0; out.textContent = ""; timer = setTimeout(tick, 900); return; }
      var ch = word[n++];
      out.textContent += ch;
      var k = keys[ch];
      if (k) { k.classList.add("hit"); setTimeout(function () { k.classList.remove("hit"); }, 170); }
      timer = setTimeout(tick, n >= word.length ? 1800 : 280);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !timer) tick();
          else if (!e.isIntersecting && timer) { clearTimeout(timer); timer = null; }
        });
      }).observe(kbd);
    } else { tick(); }
  }
})();
