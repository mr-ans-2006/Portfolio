// Theme toggle. Everything else on the page reads fine without JS.
(function () {
  var root = document.documentElement;
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
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute("content", dark ? "#121A3D" : "#F4EFE6");
    });
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
})();
