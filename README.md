# Chennai Call Girl — React conversion

This project recreates the original HTML/CSS/JS **layout** as a React + Vite application, keeping its pink-and-white visual theme, hero, header, three feature sections, 15-tile gallery, lightbox, floating contact layout and mobile responsiveness.

## Setup

```bash
npm install
npm run dev
```

To build for Vercel: `npm run build` (output directory: `dist`). Deploy to a separate Vercel preview project first. **Do not overwrite the existing live project until tested.**

## Contact details

The source ZIP contained adult-service promotional contact information. This food-themed preview intentionally leaves phone, WhatsApp and Telegram settings blank. Add appropriate verified business details in `src/siteConfig.js` to activate these buttons. Until then, contact buttons point to the contact section with instructions.

## Images

Existing folder/asset **filenames** and the gallery arrangement are preserved. The original ZIP images depict individuals in an unrelated adult-service context. Because they are not suitable for a food website, all published photographs, including the source favicon, are replaced with local food-themed illustrations (`public/images/1.jpg` to `15.jpg`, `cover.jpg`, `feature01.jpg`, `feature2.jpg`, `feature3.jpg`, and `public/favicon.png`). No remote image links.

## SEO

The preview deliberately uses `noindex, nofollow` and a blocked `robots.txt` to avoid accidentally indexing a test project, and does not point a canonical link to the unrelated original domain. Before going live on a food-business domain, update `index.html` and `public/robots.txt` appropriately.

## Structure

- `index.html` — React entry point, title/meta/favicon
- `src/App.jsx` — full header, hero, features, gallery, lightbox, footer, contact
- `src/siteConfig.js` — brand/contact/content
- `src/styles.css` — based on the original website stylesheet
- `public/images/` — 19 local image assets
- `public/favicon.png` — food bowl icon
