# Publish Mafcik’s Wonder Carnival on Cloudflare Pages

## Recommended: GitHub integration (no local build needed)

1. Extract this ZIP on your PC.
2. Create a **new GitHub repository**, then choose **Add file → Upload files** and upload the **contents** of the extracted folder (not the ZIP itself). Make sure `package.json` is at the repository root.
3. In Cloudflare Dashboard → Workers & Pages → Create → Pages → **Connect to Git**, select the repository.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Node.js version: 22 (set `NODE_VERSION` = `22` if needed).
7. Save and deploy. Cloudflare builds the TypeScript/React source automatically.

**Do not choose the dashboard's Direct Upload option for this source ZIP.** Direct Upload accepts only *prebuilt* website files. The source needs an npm/Vite build first.

## Alternative: Direct Upload

On a computer with Node.js installed, open a terminal in the project folder and run:

```bash
npm install
npm run build
```

Then upload the contents of `dist/` to Cloudflare Pages Direct Upload. Uploading the project root will trigger the TypeScript build-process error.

Note: This package contains source code. This environment could not install dependencies and therefore has not confirmed a successful build or tested all 20 minigames.
