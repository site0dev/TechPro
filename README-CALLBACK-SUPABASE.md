# TechPro — activation des liens d'e-mail Supabase

Domaine utilisé : `https://techpro.phenixconnect.online`
Callback web : `https://techpro.phenixconnect.online/auth/callback`
Package Android : `online.phenixconnect.techpro`

## Ce que contient ce lot
- `index.html` du projet fourni : il appelle déjà `signUp` avec `emailRedirectTo`, le reset avec `redirectTo`, et traite `code` / `token_hash` sur le callback.
- `patch-android-manifest.mjs` : ajoute le deep link `techpro://auth/callback` et l'Android App Link HTTPS `/auth/callback`.
- `public/.well-known/assetlinks.json.template` : modèle à compléter avec le SHA-256 réel du certificat APK.

## Supabase
Dans Authentication > URL Configuration :
1. Site URL : `https://techpro.phenixconnect.online`
2. Ajouter dans Redirect URLs : `https://techpro.phenixconnect.online/auth/callback`
3. Garder les autres URLs existantes qui sont utilisées par l'application.

Les templates e-mail Confirmation et Reset Password doivent conserver le lien Supabase `{{ .ConfirmationURL }}`. Le SDK transmet la destination de retour par `emailRedirectTo` / `redirectTo`.

## Déployer la vérification Android
1. Construire et signer l'APK final.
2. Récupérer le SHA-256 du certificat qui signe cet APK (debug ou release selon celui installé).
3. Remplacer le texte `REMPLACER_PAR_SHA256_DU_CERTIFICAT_DE_SIGNATURE_APK` dans le modèle.
4. Publier le fichier final sous `https://techpro.phenixconnect.online/.well-known/assetlinks.json` avec le type JSON.
5. Recompiler/synchroniser Android après la modification du manifeste, puis installer l'APK.

Le modèle `assetlinks.json` n'est volontairement pas un fichier actif : sans empreinte du certificat réelle, Android ne peut pas vérifier le lien de domaine. Ne publiez pas le modèle avec le texte placeholder.

## Compilation
À la racine du dépôt :
```bash
npm install
npm run android:sync
```
Puis ouvrir Android Studio ou utiliser le workflow GitHub Actions déjà présent pour générer l'APK.

## Test
- Test web : ouvrir un lien confirmation/reset sur le navigateur, vérifier le retour au callback et la session.
- Test Android : installer l'APK signé correspondant au SHA-256 publié, ouvrir le lien HTTPS depuis un e-mail, vérifier que TechPro s'ouvre.
- Pour reset password, le callback doit présenter le champ nouveau mot de passe puis enregistrer avec `supabase.auth.updateUser({ password })`.

Ne partagez pas les secrets SMTP, Supabase service role, ni la clé privée de signature.
