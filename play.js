// The two playable bits: a mini Sindhi typing test and a SindhiScript run box.
(function () {
  "use strict";

  /* ================= Typing test ================= */
  // Lines from Sindhi Typing Master's built-in set (no diacritics, so one key = one letter).
  var LINES = ["سنڌي ٻولي هڪ قديم ٻولي آهي", "تعليم هر انسان جو بنيادي حق آهي", "سنڌو درياهه سنڌ جي زندگي جو ساهه آهي", "ڪتاب پڙهڻ سان علم ۾ اضافو ٿيندو آهي", "ٺٽو هڪ تاريخي شهر آهي", "شاهه عبداللطيف ڀٽائي سنڌ جو عظيم شاعر هو"];
  // QWERTY -> Sindhi. Lower case follows Typing Master's keyboard guide; capitals are the Shift layer.
  var LATIN = {"q": "ق", "w": "ص", "e": "ي", "r": "ر", "t": "ت", "y": "ث", "u": "ع", "i": "ڳ", "o": "و", "p": "پ", "[": "چ", "]": "ڄ", "\\": "ڊ", "a": "ا", "s": "س", "d": "د", "f": "ف", "g": "گ", "h": "ه", "j": "ھ", "k": "ڪ", "l": "ل", ";": "ک", "'": "ڱ", "z": "ز", "x": "خ", "c": "ط", "v": "ٻ", "b": "ب", "n": "ن", "m": "م", ",": "،", ".": "۔", "/": "ئ", "-": "ڏ", "=": "ڍ", "Q": "ڦ", "W": "ض", "E": "ٺ", "R": "ڙ", "T": "ٽ", "Y": "ٿ", "U": "غ", "I": "ڃ", "O": "ؤ", "A": "آ", "S": "ش", "D": "ڌ", "F": "ظ", "H": "ح", "J": "ج", "K": "۽", "Z": "ذ", "X": "ژ", "C": "ڇ", "V": "ء", "N": "ڻ", "M": "۾", "?": "؟", "B": "ڀ"};
  // Look-alike letters other keyboards send, folded into the Sindhi ones.
  var FOLD = { "\u06CC": "\u064A", "\u06C1": "\u0647", "\u0643": "\u06AA", ".": "\u06D4" };

  var lineEl = document.getElementById("tt-line");
  var input = document.getElementById("tt-input");
  var box = document.getElementById("tt-box");
  if (lineEl && input) {
    var wpmEl = document.getElementById("tt-wpm");
    var accEl = document.getElementById("tt-acc");
    var timeEl = document.getElementById("tt-time");
    var resultEl = document.getElementById("tt-result");
    var srTarget = document.getElementById("tt-target-sr");
    var lineIndex = 0, target = [], typed = [], spans = [];
    var keystrokes = 0, correctStrokes = 0, start = 0, end = 0, timer = 0;
    var SENTINEL = "\u200B";
    var composing = false;

    function setLine(i) {
      lineIndex = (i + LINES.length) % LINES.length;
      target = Array.from(LINES[lineIndex]);
      lineEl.textContent = "";
      spans = target.map(function (ch) {
        var s = document.createElement("span");
        s.textContent = ch;
        lineEl.appendChild(s);
        return s;
      });
      if (srTarget) srTarget.textContent = "Line to type: " + LINES[lineIndex];
      reset();
    }
    function reset() {
      typed = []; keystrokes = 0; correctStrokes = 0; start = 0; end = 0;
      clearInterval(timer); timer = 0;
      resultEl.textContent = "";
      render(); stats();
    }
    function render() {
      for (var i = 0; i < spans.length; i++) {
        var c = "";
        if (i < typed.length) c = typed[i] === target[i] ? "ok" : "bad";
        else if (i === typed.length) c = "cur";
        spans[i].className = c;
      }
    }
    function correctChars() {
      var n = 0;
      for (var i = 0; i < typed.length; i++) if (typed[i] === target[i]) n++;
      return n;
    }
    function stats() {
      var now = end || (start ? performance.now() : 0);
      var secs = start ? (now - start) / 1000 : 0;
      var wpm = secs > 0.5 ? Math.round((correctChars() / 5) / (secs / 60)) : 0;
      var acc = keystrokes ? Math.round((correctStrokes / keystrokes) * 100) : 100;
      wpmEl.textContent = String(wpm);
      accEl.textContent = acc + "%";
      timeEl.textContent = secs.toFixed(1) + "s";
      return { wpm: wpm, acc: acc, secs: secs };
    }
    function finish() {
      end = performance.now();
      clearInterval(timer); timer = 0;
      var s = stats();
      resultEl.textContent = "Done: " + s.wpm + " WPM at " + s.acc + "% accuracy in " + s.secs.toFixed(1) + " seconds. Press New line for another.";
    }
    function typeChar(ch) {
      if (FOLD[ch]) ch = FOLD[ch];
      if (end || typed.length >= target.length) return;
      if (!start) {
        start = performance.now();
        timer = setInterval(stats, 200);
      }
      var ok = ch === target[typed.length];
      typed.push(ch);
      keystrokes++;
      if (ok) correctStrokes++;
      render(); stats();
      if (typed.length === target.length) finish();
    }
    function back() {
      if (end || !typed.length) return;
      typed.pop();
      render(); stats();
    }
    function feed(text) {
      Array.from(text).forEach(function (ch) {
        if (ch === SENTINEL || ch === "\n" || ch === "\r") return;
        if (LATIN[ch]) ch = LATIN[ch];
        typeChar(ch);
      });
    }
    function resetInput() { input.value = SENTINEL; }
    resetInput();

    input.addEventListener("compositionstart", function () { composing = true; });
    input.addEventListener("compositionend", function () { composing = false; handleValue(); });
    input.addEventListener("input", function () { if (!composing) handleValue(); });
    function handleValue() {
      var v = input.value;
      if (v === "") { back(); }
      else if (v.charAt(0) !== SENTINEL) { feed(v); }
      else { feed(v.slice(1)); }
      resetInput();
    }
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && input.value === SENTINEL) { e.preventDefault(); back(); }
      else if (e.key === "Enter") { e.preventDefault(); if (end) setLine(lineIndex + 1); }
      else if (e.key === "Escape") { input.blur(); }
    });
    // keep the caret after the sentinel so Backspace on desktop removes it (handled above)
    input.addEventListener("focus", function () { resetInput(); });

    document.getElementById("kb").addEventListener("click", function (e) {
      var k = e.target.closest(".key");
      if (!k) return;
      if (k.dataset.action === "back") back();
      else if (k.dataset.ch) typeChar(k.dataset.ch);
    });
    // mouse/touch on keys must not steal focus from the hidden input
    document.getElementById("kb").addEventListener("mousedown", function (e) { if (e.target.closest(".key")) e.preventDefault(); });

    // light up the on-screen key that matches a physical key press
    var keyFor = {};
    document.querySelectorAll(".key[data-ch]").forEach(function (k) { keyFor[k.dataset.ch] = k; });
    input.addEventListener("keydown", function (e) {
      var ch = LATIN[e.key] || FOLD[e.key] || e.key;
      var k = keyFor[ch];
      if (k) { k.classList.add("is-down"); setTimeout(function () { k.classList.remove("is-down"); }, 120); }
    });

    document.getElementById("tt-next").addEventListener("click", function () { setLine(lineIndex + 1); });
    document.getElementById("tt-restart").addEventListener("click", function () { reset(); });
    setLine(0);
  }

  /* ================= SindhiScript runner ================= */
  var EXAMPLES = {
 "fact": {
  "file": "فيڪٽوريل.سن",
  "code": "ڪم فيڪٽوريل(ن):\n    جيڪڏهن ن گهٽ_برابر 1:\n        موٽايو 1\n    موٽايو ن ضرب فيڪٽوريل(ن گهٽائڻ 1)\n\nهر ع ۾ حد(1، 6):\n    ڇاپ(فيڪٽوريل(ع))"
 },
 "loop": {
  "file": "لوپ.سن",
  "code": "# لوپ ۽ فنڪشن\nڪم چورس(عدد):\n    موٽايو عدد ضرب عدد\n\nمتغير ڳڻپ = 1\nجڏهن_تائين ڳڻپ گهٽ_برابر 5:\n    ڇاپ(ڳڻپ، \"جو چورس آهي\"، چورس(ڳڻپ))\n    ڳڻپ = ڳڻپ جمع 1"
 },
 "hello": {
  "file": "سلام.سن",
  "code": "ڪم سلام_ڪريو(نالو):\n    ڇاپ(\"سلام،\"، نالو)\n\nسلام_ڪريو(\"سنڌ\")\nسلام_ڪريو(\"ڪراچي\")"
 },
 "err": {
  "file": "غلطي.سن",
  "code": "# نالو اڃا ٺهيو ئي ناهي\nڇاپ(نالو)"
 }
};
  var RUN_LIMIT_MS = 8000;
  var BOOT_LIMIT_MS = 90000;
  var codeIn = document.getElementById("code-in");
  var runBtn = document.getElementById("run-btn");
  if (!codeIn || !runBtn) return;
  var out = document.getElementById("out");
  var meta = document.getElementById("out-meta");
  var fileEl = document.getElementById("code-file");
  var outFile = document.getElementById("out-file");
  var worker = null, ready = false, busy = false, killTimer = 0, t0 = 0;

  function show(text, isError, metaText, live) {
    out.textContent = text;
    out.classList.toggle("is-error", !!isError);
    out.setAttribute("lang", /[\u0600-\u06FF]/.test(text) ? "sd" : "en");
    meta.textContent = metaText;
    meta.classList.toggle("is-live", !!live);
  }
  function done() {
    busy = false; clearTimeout(killTimer);
    runBtn.disabled = false; runBtn.textContent = "Run";
  }
  function kill(msg) {
    if (worker) { worker.terminate(); worker = null; ready = false; }
    show(msg, true, "The worker was stopped and will reload on the next run.", false);
    done();
  }
  function getWorker() {
    if (worker) return worker;
    worker = new Worker("sindhiscript-worker.js");
    worker.onmessage = function (e) {
      var m = e.data || {};
      if (m.type === "ready") {
        ready = true;
        if (busy) { meta.textContent = "Interpreter loaded. Running…"; send(); }
      } else if (m.type === "boot-error") {
        kill("Couldn’t load the interpreter: " + m.error + "\nYou can still run it on the live demo: https://mr-ans-2006.github.io/SindhiScript/");
      } else if (m.type === "result") {
        var r = m.result || {};
        var ms = Math.round(performance.now() - t0);
        var text = (r.output || "");
        if (r.error) text += (text && !/\n$/.test(text) ? "\n" : "") + r.error;
        if (!text) text = "(no output)";
        show(text.replace(/\n$/, ""), r.status !== "ok", (r.status === "ok" ? "Ran in your browser in " : "Stopped with an error after ") + ms + " ms.", r.status === "ok");
        done();
      }
    };
    worker.onerror = function (e) { kill("The interpreter crashed: " + (e.message || "unknown error")); };
    return worker;
  }
  function send() {
    t0 = performance.now();
    clearTimeout(killTimer);
    killTimer = setTimeout(function () { kill("Stopped after " + RUN_LIMIT_MS / 1000 + " seconds. Is there a loop that never ends?"); }, RUN_LIMIT_MS);
    worker.postMessage({ type: "run", payloadJson: JSON.stringify({ source: codeIn.value, stdin: [], modules: {} }) });
  }
  runBtn.addEventListener("click", function () {
    if (busy) return;
    busy = true; runBtn.disabled = true; runBtn.textContent = "Running…";
    getWorker();
    if (ready) { send(); return; }
    show(out.textContent, false, "Loading the interpreter (first run only)…", false);
    worker.postMessage({ type: "boot" });
    clearTimeout(killTimer);
    killTimer = setTimeout(function () { kill("The interpreter took too long to load. Check your connection and press Run again."); }, BOOT_LIMIT_MS);
  });
  codeIn.addEventListener("keydown", function (e) {
    if (e.key === "Tab" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      var s = codeIn.selectionStart, en = codeIn.selectionEnd;
      codeIn.setRangeText("    ", s, en, "end");
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault(); runBtn.click();
    }
  });
  document.querySelectorAll(".chip-btn[data-ex]").forEach(function (b) {
    b.addEventListener("click", function () {
      var ex = EXAMPLES[b.dataset.ex];
      if (!ex) return;
      document.querySelectorAll(".chip-btn[data-ex]").forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      codeIn.value = ex.code;
      fileEl.textContent = ex.file; outFile.textContent = ex.file;
      show("", false, "Press Run to see the output.", false);
    });
  });
})();
