# Giada Pasqualato — portfolio

A static portfolio for an aspiring Junior Data Analyst. No build step or package installation is required.

Website: <https://datajada.github.io/portfolio/>.

## GitHub Pages deployment

GitHub Pages publishes the root of the `main` branch in `datajada/portfolio`, with HTTPS enforced. The root `.nojekyll` file keeps this plain HTML/CSS/JavaScript site from being processed by Jekyll.

To publish changes, commit and push to `main`, then check the Pages build/deployment in the repository's Actions tab. Pages settings should remain **Deploy from a branch**, branch **main**, folder **/(root)**. Asset links stay relative so they work under the `/portfolio/` project path.

## Local preview

From this folder, run:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000> in a browser.

## Files

- `index.html`: profile, two project cards, verified training, and contact links.
- `css/tailwind/tailwind.min.css`: the exported Tailwind styles.
- `css/site.css`: core styling, hover/focus effects, responsive previews, and reduced-motion support.
- `css/navigation.css`: fixed navigation, anchor spacing, active links, and reading progress.
- `css/hero.css`: the introductory notebook and workflow animations.
- `css/fonts.css` and `assets/fonts/`: self-hosted Latin font subsets and their OFL licenses.
- `js/navigation.js`: accessible mobile/fixed navigation and scroll progress.
- `js/site.js`: a finite, decorative code-typing animation.
- `assets/images/giada.jpeg`: Giada's edited portrait, with a softly blurred background, the red door handle and table mat removed, and a WebP companion for the website.
- `assets/images/project-*.jpg`: previews from the actual project reports.
- `assets/projects/`: the two original reports downloaded from Giada's public LinkedIn posts.
- `assets/certificates/`: certificate image previews and the original supplied BCS and Coursera PDFs.
- `assets/documents/giada-pasqualato-cv.pdf`: the supplied CV, linked from the About section and preserved unchanged.
- `assets/favicon.svg`, `assets/favicon-32.png`, and `assets/apple-touch-icon.png`: browser and mobile icons.
- `.nojekyll`: serves the GitHub Pages source as a plain static site.
- `sitemap.xml` and `robots.txt`: the canonical homepage sitemap and its discovery URL.

## Confirmed content and sources

The biography and contact details were supplied by the user. Public profiles:

- LinkedIn: <https://www.linkedin.com/in/giada-pasqualato/>
- GitHub: <https://github.com/datajada/>
- Email: <mailto:giada.pasqualato.ncs@gmail.com>

Projects:

- Corporate Greenwashing Risk Assessment: European Food & Beverage Sector. Original post: <https://www.linkedin.com/feed/update/urn:li:activity:7520872825184837632/>. Preview: charts on report page 19.
- Accessibility and Completeness of Information about Public Facilities in Tallinn for Wheelchair Users. Collaboration with Nadezhda Gueva. Original post: <https://www.linkedin.com/feed/update/urn:li:activity:7519040336975847424/>. Preview: presentation page 5.

The BCS and Coursera certificates form one combined training pathway:

- BCS Koolitus Data Analytics Program: April 15–August 26, 2026; 257 academic hours. Certificate issued August 28, 2026.
- Google Data Analytics Professional Certificate via Coursera: nine courses; issued August 20, 2026. Verification: <https://coursera.org/verify/professional-cert/MEUHDWO3OKZO>.

A separate Google Analytics Certification from Skillshop was issued February 16, 2026 and expires February 16, 2027. Verification: <https://skillshop.credential.net/e4d4e8e3-8f17-4cae-bfa4-53bbdb6a94b3#acc.P6gula4s>.

The BCS certificate PDF is a byte-for-byte copy of the supplied original, including its ID and QR code, as requested. The BCS and Coursera previews are rendered from the original supplied PDFs. The Skillshop image is captured from the actual certificate view on its verified public credential page. Source PDFs in Downloads remain unchanged.

Contact uses email and profile links. The About section includes a View CV button that opens the supplied original PDF in a new tab. There is no form backend.


## Loading and accessibility

The site renders its content as static HTML immediately, without a loading overlay. Fonts are self-hosted WOFF2 Latin subsets with `display=swap` and system fallbacks. Above-the-fold fonts are preloaded; no third-party font request is needed. Images use WebP with JPEG fallback, fixed dimensions, asynchronous decoding, and lazy loading. PDFs load only when opened.

The six WebP companions total 363,434 bytes, compared with 599,705 bytes for the JPEG originals: 236,271 bytes (39.4%) less image data for browsers using WebP. Regenerate the WebP companion and update the portrait content-version query whenever replacing a JPEG; keep the fallback in sync.

The page includes a keyboard skip link, named sections and a main landmark, visible focus outlines, larger navigation/link targets, and reduced-motion support. Mobile links are visible in the original HTML; the navigation script hides them only after successfully enabling the menu button. Without JavaScript, the header remains in normal document flow and navigation stays usable. The fixed header measures its own height, reserves that space, and offsets anchor targets.

The hero keeps its heading and primary content visible immediately. Only the decorative notebook types code, then reveals its portfolio snapshot and three workflow stages. It runs once, reserves its full layout height, and stops on completion, when offscreen, when the document is hidden, or when reduced motion is requested. Without JavaScript or with reduced motion, the full static notebook is visible.

The code is an illustrative Python example using the two real portfolio topics, not a live data-analysis engine or a claim of additional client results.

The green availability dot gently pulses while the intro is visible. Its animation pauses offscreen or when the tab is hidden, and stays still with reduced motion enabled.

## Search and sharing metadata

The head includes a descriptive title and summary, author, theme color, canonical URL, Open Graph profile metadata, Twitter summary metadata, and a ProfilePage/Person JSON-LD record grounded in the confirmed biography and profile links. The canonical address and profile URL are <https://datajada.github.io/portfolio/>. Social previews use the absolute, content-versioned portrait JPEG URL, with dimensions and descriptive alt text.

The single-page sitemap is <https://datajada.github.io/portfolio/sitemap.xml> and is referenced in `robots.txt`. Update its `lastmod` date when the site content changes. If the public URL changes, update the canonical, Open Graph, structured data, social-image, sitemap, and robots URLs together.

The Skillshop expiry is shown as a fixed date rather than an automatically renewed validity claim. Update it after renewal.


## PageSpeed validation

The confirmed public URL <https://datajada.github.io/portfolio/> is ready for mobile and desktop tests at <https://pagespeed.web.dev/> once the Pages deployment completes. No measured PageSpeed score is claimed in this README. Field data may need enough real visits before it becomes available.

Local checks cover image/font assets, syntax, semantic HTML, native anchor offsets, fixed/mobile navigation, animation completion, responsive layout, and the static/reduced-motion fallbacks. Rerun hosted performance reports after significant content or asset changes.
