import { build } from 'vite';
import { fileURLToPath } from 'node:url';

// Keep PNGs, fonts, and code as ordinary files. Serve this folder over HTTP.
const root = fileURLToPath(new URL('..', import.meta.url));
await build({ root, build: { outDir: 'docs/previews/game', emptyOutDir: true, assetsInlineLimit: 0 } });
console.log('Playable preview saved in docs/previews/game. Run: npx vite preview --outDir docs/previews/game');
