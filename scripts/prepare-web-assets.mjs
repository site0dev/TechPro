import { mkdir, copyFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const publicDir = resolve(root, 'public');
await mkdir(publicDir, { recursive: true });

// Le dépôt existant garde manifest.json, sw.js et les icônes à sa racine.
// Vite ne copie automatiquement que le contenu de public/ : on les y place
// avant le build, sans toucher aux fichiers sources du dépôt.
const assets = ['manifest.json', 'sw.js', 'icon-192.png', 'icon-512.png'];
for (const file of assets) {
  const source = resolve(root, file);
  try {
    await access(source, constants.R_OK);
    await copyFile(source, resolve(publicDir, file));
    console.log(`Asset web préparé : ${file}`);
  } catch {
    if (file === 'manifest.json') {
      throw new Error('manifest.json est absent de la racine du dépôt.');
    }
    console.log(`Asset facultatif absent, ignoré : ${file}`);
  }
}
