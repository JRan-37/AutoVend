# AutoVend Systems — Marketing Site

Static prototype. Hash-routed React via Babel-standalone (no build step).

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo.
2. **Settings → Pages → Source: Deploy from a branch**, pick `main` (or your branch) and `/` (root).
3. Wait ~1 min. Site serves at `https://<user>.github.io/<repo>/`.

The `.nojekyll` file at the root disables Jekyll processing so files starting with `_` (none here today, but safe) and JSX files are served as-is.

## Local preview

Any static server works:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly via `file://` will fail to load the `.jsx` modules — use a server.

## Routes

All routes are hash-based (`#/`, `#/features`, `#/dashboard`, etc.) so deep links work on Pages without any rewrite rules.

## File map

```
index.html              entry; loads React, Babel, then the app scripts
styles.css              tokens + global styles
data.jsx                shared static data
tweaks-panel.jsx        Tweaks UI (toggle from preview chrome)
components.jsx          shared chrome — nav, footer, primitives
map.jsx                 US reach map
dashboard.jsx           operator console demo
pages-marketing.jsx     home, location, advertising, features, reach
pages-forms.jsx         survey, contact
app.jsx                 router + mount
assets/                 logos
```
