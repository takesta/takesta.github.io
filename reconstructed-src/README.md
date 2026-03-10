# Reconstructed Source Snapshot

This folder is a readability snapshot reconstructed from:

- `static/js/main.7c07dc9d.js.map`

## Important

- This directory is for easier inspection/edit planning.
- Editing files here **does not** change the live site by itself.
- The deployed site runs bundled assets referenced by `index.html` and `asset-manifest.json`.

## Workflow for `/prospective` content updates

1. Edit `reconstructed-src/Prospective.js`.
2. Keep `Prospective.js` in the simple format this repo supports:
   - exactly one `<h2>...</h2>`
   - exactly one `<p>...</p>`
3. Apply those text changes into the production bundle:

```bash
python tools/apply_prospective_content.py
```

4. Commit and deploy the updated `static/js/main.7c07dc9d.js`.

## Current limitation

Because this repository only has built artifacts (not the original React source/build pipeline), the sync script updates **text content** for `/prospective` only (the `<h2>` and `<p>` string values).

## How to regenerate the reconstructed snapshot

```bash
python tools/reconstruct_from_sourcemap.py
```
