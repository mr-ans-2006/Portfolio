# Portfolio

The personal portfolio of Ali Nawaz, a Computer Science student at SMIU in Karachi, originally from Islamkot, Tharparkar. It shows my projects for the Sindhi language, [SindhiScript](https://github.com/mr-ans-2006/SindhiScript) and [Sindhi Typing Master](https://github.com/mr-ans-2006/Sindhi-Typing-Master), and lets you try both on the page.

**Live:** https://mr-ans-2006.github.io/Portfolio/

## Features

- **Ajrak colours.** Deep indigo, madder red and cream, with Ajrak block-print bands drawn as inline SVG patterns (no images). Light mode is cream with indigo and red; dark mode is indigo.
- **A mini typing test in Sindhi.** Type a Sindhi line and see live WPM, accuracy and per-letter colouring. It works with a Sindhi keyboard layout, with plain QWERTY (mapped to Sindhi, shown on each key), or by tapping the on-screen keyboard of all 52 Sindhi letters in Typing Master's order.
- **Run SindhiScript on the page.** Edit a snippet and press Run: the real SindhiScript interpreter runs in your browser in a Web Worker (Pyodide), loaded from the [SindhiScript live demo](https://mr-ans-2006.github.io/SindhiScript/), with examples and Sindhi error messages.
- **Bento project grid.** SindhiScript, Typing Master (real screenshots), the Islamkot to Karachi route map and my networking labs.
- Follows the system light/dark setting, and the toggle remembers your choice. No animations beyond small colour changes, and those are switched off for `prefers-reduced-motion`.

## Tech

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

- `index.html`: the page
- `styles.css`: the styles, with every colour in theme tokens for light and dark mode
- `theme.js`: applies the saved theme before the first paint
- `script.js`: the theme toggle
- `play.js`: the typing test and the SindhiScript run box
- `sindhiscript-worker.js`: the Web Worker that loads and runs the interpreter
- `fonts/`: the self-hosted fonts (see below)

The only requests to another site are made when you press Run: the worker loads Pyodide and the interpreter files from `mr-ans-2006.github.io/SindhiScript/` (about 11 MB, once).

## Run it locally

Clone the repo and serve the folder (the run box needs a web server, not `file://`):

```sh
git clone https://github.com/mr-ans-2006/Portfolio.git
cd Portfolio
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Fonts

All bundled fonts are under the [SIL Open Font License 1.1](https://openfontlicense.org), which allows redistribution. The full license and copyright notices are in [`fonts/OFL.txt`](fonts/OFL.txt). The files are web subsets made with fontTools.

| File | Font | Copyright |
| --- | --- | --- |
| `fonts/rozha.woff2` | Rozha One | Indian Type Foundry |
| `fonts/hanken.woff2` | Hanken Grotesk | The Hanken Grotesk Project Authors |
| `fonts/naskh.woff2` | Noto Naskh Arabic | The Noto Project Authors |
| `fonts/jbmono.woff2` | JetBrains Mono | The JetBrains Mono Project Authors |

On Apple devices, Sindhi text uses the system font SF Arabic. It is not bundled, because Apple's license doesn't allow that. Other devices use the bundled Noto Naskh Arabic.

## License

The code is under the [MIT License](LICENSE). The fonts keep their own license (OFL 1.1, above). My photo and the project screenshots are not covered by the MIT License.
