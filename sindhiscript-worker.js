/* SindhiScript run box, worker.
 *
 * Runs Ali's real SindhiScript interpreter (Python, on Pyodide) off the page's main
 * thread, so a hung program can be stopped with worker.terminate().
 * The runtime and the interpreter files load from the SindhiScript live demo,
 * the same files that demo runs: https://mr-ans-2006.github.io/SindhiScript/
 * Its harness (demo_run.py) is the demo's sandbox: Python interop limited to
 * math, random, json and datetime.
 */
"use strict";

var BASE = "https://mr-ans-2006.github.io/SindhiScript/";
var PKG = "سنڌي";
var FILES = ["__init__.py", "tokenizer.py", "lexer.py", "parser.py", "ast_nodes.py",
  "environment.py", "errors.py", "evaluator.py", "stdlib.py", "module_loader.py"];
var pyodide = null, bootPromise = null;

function boot() {
  if (bootPromise) return bootPromise;
  bootPromise = (async function () {
    importScripts(BASE + "pyodide/pyodide.js");
    pyodide = await loadPyodide({ indexURL: BASE + "pyodide/" });
    pyodide.runPython("import sys; sys.path.insert(0, '/')");
    var fs = pyodide.FS;
    try { fs.mkdir("/interpreter"); } catch (e) {}
    try { fs.mkdir("/interpreter/" + PKG); } catch (e) {}
    var texts = await Promise.all(FILES.map(function (name) {
      return fetch(BASE + "interpreter/" + encodeURIComponent(PKG) + "/" + name).then(function (r) {
        if (!r.ok) throw new Error("couldn’t load " + name + " (" + r.status + ")");
        return r.text();
      });
    }));
    FILES.forEach(function (name, i) { fs.writeFile("/interpreter/" + PKG + "/" + name, texts[i]); });
    var h = await fetch(BASE + "demo_run.py");
    if (!h.ok) throw new Error("couldn’t load demo_run.py (" + h.status + ")");
    fs.writeFile("/demo_run.py", await h.text());
    pyodide.runPython("import demo_run");
  })();
  bootPromise.catch(function () { bootPromise = null; });
  return bootPromise;
}

self.onmessage = async function (event) {
  var msg = event.data || {};
  if (msg.type === "boot") {
    try { await boot(); self.postMessage({ type: "ready" }); }
    catch (err) { self.postMessage({ type: "boot-error", error: String((err && err.message) || err) }); }
    return;
  }
  if (msg.type === "run") {
    try {
      await boot();
      pyodide.globals.set("payload_json", msg.payloadJson);
      var res = pyodide.runPython("demo_run.run_demo_json(payload_json)");
      self.postMessage({ type: "result", result: JSON.parse(res) });
    } catch (err) {
      self.postMessage({ type: "result", result: { status: "error", output: "", error: "غلطي: " + String((err && err.message) || err) } });
    }
  }
};
