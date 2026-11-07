
import { defineConfig } from 'vite';
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',

  // Aucun dossier public
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
        const destinationDir = resolve(
          'dist',
          '.well-known'
        );
        const destination = resolve(
          destinationDir,
          'assetlinks.json'
        );

        if (!existsSync(source)) {
          throw new Error(
            'assetlinks.json introuvable à la racine GitHub'
          );
        }

        mkdirSync(destinationDir, {
          recursive: true
        });

        copyFileSync(source, destination);

        console.log(
          'assetlinks.json copié avec succès dans dist/.well-known/'
        );
      }
    }
  ]
});
 
