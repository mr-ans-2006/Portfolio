# Portfolio

The personal portfolio of Ali Nawaz, a Computer Science student at SMIU in Karachi, originally from Islamkot, Tharparkar. It shows my two projects for the Sindhi language, [SindhiScript](https://github.com/mr-ans-2006/SindhiScript) and [Sindhi Typing Master](https://github.com/mr-ans-2006/Sindhi-Typing-Master).

**Live:** https://mr-ans-2006.github.io/Portfolio/

## Tech

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies, and no requests to other sites.

- `index.html`: the page
- `styles.css`: the styles, with every colour in theme tokens for light and dark mode
- `theme.js`: applies the saved theme before the first paint
- `script.js`: the theme toggle and the scroll reveal
- `fonts/`: the self-hosted fonts (see below)

The page follows the system light/dark setting, and the toggle remembers your choice. Animations respect `prefers-reduced-motion`.

## Run it locally

Clone the repo and open `index.html` in a browser. To serve it the way it runs online:

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
| `fonts/pixelify.woff2` | Pixelify Sans | The Pixelify Sans Project Authors |
| `fonts/caveat.woff2` | Caveat | The Caveat Project Authors |
| `fonts/jbmono.woff2` | JetBrains Mono | The JetBrains Mono Project Authors |
| `fonts/naskh.woff2` | Noto Naskh Arabic | The Noto Project Authors |

On Apple devices, Sindhi text uses the system font SF Arabic. It is not bundled, because Apple's license doesn't allow that. Other devices use the bundled Noto Naskh Arabic.

## License

The code is under the [MIT License](LICENSE). The fonts keep their own license (OFL 1.1, above). My photo and the project screenshots are not covered by the MIT License.
