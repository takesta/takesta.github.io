# Reconstructed Source Snapshot

This folder is a readability snapshot reconstructed from:

- `static/js/main.7c07dc9d.js.map`

## Important

- This directory is for easier inspection/edit planning.
- Editing files here **does not** change the live site by itself.
- The deployed site runs bundled assets referenced by `index.html` and `asset-manifest.json`.

## Workflow for `/prospective` content updates

1. Edit `reconstructed-src/Prospective.js`.
2. Apply those text changes into the production bundle:

```bash
python tools/apply_prospective_content.py
```

3. Commit and deploy the updated `static/js/main.7c07dc9d.js`.

## How to regenerate the reconstructed snapshot

```bash
python tools/reconstruct_from_sourcemap.py
```

To keep the website unchanged, avoid editing/replacing files under `static/js` and `static/css` unless you intentionally want to deploy a new build.
