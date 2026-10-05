// Wstawia HTML z dist-ssr/entry-server.js w miejsce <!--app-html--> w dist/index.html.
import { readFile, writeFile, rm } from 'node:fs/promises';

const { render } = await import('./dist-ssr/entry-server.js');
const file = new URL('./dist/index.html', import.meta.url);
const html = await readFile(file, 'utf8');
if (!html.includes('<!--app-html-->')) throw new Error('Brak <!--app-html--> w dist/index.html');
await writeFile(file, html.replace('<!--app-html-->', render()));
await rm(new URL('./dist-ssr', import.meta.url), { recursive: true, force: true });
console.log('prerender: dist/index.html');
