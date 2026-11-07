
import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',

  // Le dossier public n'existe plus
  publicDir: false,

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022'
  },

  plugins: [
    {
      name: 'copy-assetlinks',

      closeBundle() {
        const source = resolve('assetlinks.json');
        const destinationDir = resolve('dist/.well-known');
        const destination = resolve(destinationDir, 'assetlinks.json');

        if (!existsSync(source)) {
          throw new Error('assetlinks.json est absent de la racine du projet');
        }

        mkdirSync(destinationDir, { recursive: true });
        copyFileSync(source, destination);

        console.log('assetlinks.json copié dans dist/.well-known/');
      }
    }
  ]
});
