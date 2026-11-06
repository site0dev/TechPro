# TechPro – fichiers complémentaires pour GitHub Actions / Capacitor

Ce lot est destiné au dépôt TechPro qui contient déjà à sa racine :

- `index.html` (HTML/CSS/JavaScript intégrés)
- `manifest.json`
- `sw.js`
- `192.png`
- `icon-512.png`

## Installation dans GitHub

Décompresser l'archive puis copier les fichiers et dossiers à la racine du dépôt en conservant exactement leur arborescence. Ne pas remplacer `index.html`, `manifest.json`, `sw.js` ou les icônes existants.

Fichiers ajoutés :

- `package.json` : dépendances Capacitor et Vite, versions alignées sur le paquet TechPro le plus récent retrouvé.
- `capacitor.config.ts` : identifiant Android `online.phenixconnect.techpro`.
- `vite.config.ts` et `tsconfig.json` : configuration de compilation.
- `src/capacitor-bridge.js` : pont natif utilisé par le HTML pour FedaPay et les retours dans l'application.
- `scripts/prepare-web-assets.mjs` : copie les fichiers PWA de la racine vers `public/` pour Vite.
- `scripts/patch-android-manifest.mjs` : ajoute le lien profond `techpro://auth/callback` à Android.
- `.github/workflows/build-android.yml` : compilation APK sur GitHub Actions.
- `.gitignore` : ignore les dépendances et la plateforme Android générée.

## Lancer la compilation

1. Envoyer tous les fichiers dans le dépôt GitHub, branche `main` ou `master`.
2. Ouvrir l'onglet **Actions**.
3. Sélectionner **Build TechPro Android APK**.
4. Cliquer sur **Run workflow** puis confirmer.
5. Attendre la fin du workflow.
6. Dans le résultat de l'exécution, télécharger l'artefact **TechPro-Android-APK**.
7. Décompresser l'archive téléchargée : elle contient `app-debug.apk`.

Une compilation est aussi déclenchée automatiquement après un push sur `main` ou `master` si un fichier du projet concerné change.

## Supabase et FedaPay

Les fonctions Edge TypeScript continuent de s'exécuter sur Supabase. Il n'est pas nécessaire de les copier dans Android ni de les compiler avec l'application. Le HTML conserve son appel à la fonction `create-fedapay-payment`.

Ne jamais ajouter à GitHub la clé secrète FedaPay (`FEDAPAY_SECRET_KEY`) ni la clé `SUPABASE_SERVICE_ROLE_KEY`. Elles doivent rester dans les secrets Supabase. La clé Supabase publishable/anon utilisée côté client peut être publique selon la configuration RLS.

## Lien de récupération de compte

Le script ajoute `techpro://auth/callback` dans le manifeste Android. Ajouter aussi exactement cette URL dans Supabase Dashboard > Authentication > URL Configuration > Redirect URLs, en conservant l'URL web déjà utilisée par le site.

## Type de fichier généré

Ce workflow génère un APK **debug** signé automatiquement avec la clé de débogage Android. Il sert à installer et tester l'application. Pour distribuer une version de production ou publier sur Google Play, il faudra ensuite configurer une clé de signature release et générer un AAB.

## Important

- La compilation GitHub Actions nécessite Internet côté serveur GitHub. Aucun SDK Android ni Android Studio n'est à installer sur le téléphone.
- L'application a besoin d'Internet pour Supabase et FedaPay.
- Le dossier `android/` est généré pendant la compilation et n'a pas besoin d'être ajouté manuellement au dépôt.
- Le workflow suppose que le HTML existant contient bien `<script type="module" src="./src/capacitor-bridge.js"></script>` et appelle `window.TechProNative` comme dans la version TechPro la plus récente retrouvée.
