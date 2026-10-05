# Photography sources

Every photograph on the site is from Unsplash and is used under the
[Unsplash License](https://unsplash.com/license) (free for commercial use, no
permission or attribution required). Credits are kept here anyway, so each
file can be traced back to its original. None are Unsplash+ (paid) images.

Files in `public/images/` are derived: downloaded at 2400px, then cover-cropped
to 3:4 (768x1024, WebP q78) for the homepage service cards, or resized to
2400px wide (WebP q78) for page heroes. Selected 2026-10-03.

| File | Unsplash photo | Photographer |
|---|---|---|
| `services/mvp.webp` | https://unsplash.com/photos/QY39YPpkxaI | Glen Carrie |
| `services/saas.webp` | https://unsplash.com/photos/shr_Xn8S8QU | Stephen Phillips (Hostreviews.co.uk) |
| `services/e2e.webp` | https://unsplash.com/photos/wD1LRb9OeEo | Austin Distel |
| `services/webapp.webp` | https://unsplash.com/photos/OGOWDVLbMSc | Campaign Creators |
| `services/business.webp` | https://unsplash.com/photos/VFMhqkiL6E4 | Evgeniy Surzhan |
| `services/portfolio.webp` | https://unsplash.com/photos/bs2Ba7t69mM | Ben Kolde |
| `services/ai.webp` | https://unsplash.com/photos/fEsi8nn6a1g | Zulfugar Karimov |
| `services/automation.webp` | https://unsplash.com/photos/--kQ4tBklJI | Campaign Creators |
| `services/recruiting.webp` | https://unsplash.com/photos/9si2noVCVH8 | Resume Genius |
| `pages/software-engineering-desk.webp` | https://unsplash.com/photos/uyfohHiTxho | ThisisEngineering |
| `pages/recruiting-graduate.webp` | https://unsplash.com/photos/RpxgkJRqg5I | RUT MIIT |
| `sections/planning.webp` | https://unsplash.com/photos/qC2n6RQU4Vw | UX Indonesia |
| `sections/candidate.webp` | https://unsplash.com/photos/7d4LREDSPyQ | X (@disruptxn) |
| `sections/architecture.webp` | https://unsplash.com/photos/3V8xo5Gbusk | Kaleidico |
| `sections/applying.webp` | https://unsplash.com/photos/HA-0i0E7sq4 | Daniel Thomas |

Replaced 2026-10-06 (owner: the old page heroes were generic posed stock):
`pages/software.webp` (NK2PfIZOQkA, Vitaly Gariev) and `pages/recruiting.webp`
(97jYS9-RzgA, Vitaly Gariev). The new heroes have new file names on purpose:
optimised images are cached by URL, so reusing a name served the old photo.
`pages/software-engineering-desk.webp` is cropped to the top 86% of the
original to remove a head at the bottom edge. `sections/*` are 1600-1800px wide,
WebP q80, cropped in CSS (object-position) rather than in the file.
