
import { defineConfig } from 'vite';
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',

  publicDir: false,

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022'
  },

  plugins: [
    {
      name: 'copy-assetlinks-from-root',

      closeBundle() {
        const source = resolve('assetlinks.json');
        const destinationDir = resolve('dist/.well-known');
        const destination = resolve(
          destinationDir,
          'assetlinks.json'
        );

        if (!existsSync(source)) {
          throw new Error(
            'ERREUR : assetlinks.json introuvable à la racine'
          );
        }

        mkdirSync(destinationDir, { recursive: true });
        copyFileSync(source, destination);

        console.log(
          'SUCCESS : assetlinks.json copié dans dist/.well-known/'
        );
      }
    }
  ]
});
 
