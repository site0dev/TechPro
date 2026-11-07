
# TechPro — Configuration des liens de récupération

## 1. Domaine de l'application

Domaine officiel :

https://techpro.phenixconnect.online/

Application Android :

- Nom : TechPro
- Package : online.phenixconnect.techpro

## 2. URL de callback Supabase

URL de callback :

https://techpro.phenixconnect.online/auth/callback

Cette URL doit être autorisée dans Supabase.

Dans Supabase :

Authentication
→ URL Configuration
→ Redirect URLs

Ajouter :

https://techpro.phenixconnect.online/auth/callback

Ne pas remplacer cette URL par une URL localhost.

## 3. Liens de récupération

Les emails de récupération doivent rediriger vers :

https://techpro.phenixconnect.online/auth/callback

Le lien de récupération doit conserver les paramètres ou le fragment de récupération générés par Supabase.

Ne pas supprimer :

- access_token
- refresh_token
- type
- code

Le format exact dépend du type de lien généré par Supabase.

## 4. Android App Links

Domaine :

techpro.phenixconnect.online

Package :

online.phenixconnect.techpro

Fichier d'association :

https://techpro.phenixconnect.online/.well-known/assetlinks.json

Le fichier assetlinks.json doit contenir :

- le package Android exact
- le SHA-256 du certificat de signature de l'APK installé

Le certificat utilisé dans assetlinks.json doit correspondre
à celui de la version Android distribuée.

## 5. Manifest Android

Le manifeste Android doit déclarer :

- android:autoVerify="true"
- android.intent.action.VIEW
- android.intent.category.DEFAULT
- android.intent.category.BROWSABLE
- scheme https
- host techpro.phenixconnect.online
- pathPrefix /auth/callback

Le manifeste est modifié par :

patch-android-manifest.mjs

Ne pas créer un deuxième manifeste à la racine du dépôt.

## 6. Compilation

Après modification du manifeste :

1. Vérifier que le script patch-android-manifest.mjs est exécuté.
2. Synchroniser le projet Capacitor Android.
3. Appliquer le patch au manifeste.
4. Compiler l'application.
5. Signer l'APK avec le certificat attendu.
6. Installer la nouvelle APK sur Android.

## 7. Vérification

Tester :

https://techpro.phenixconnect.online/.well-known/assetlinks.json

Le résultat doit être le JSON d'association Android.

Tester ensuite un lien de récupération Supabase.

L'ouverture directe dans l'application nécessite :

- un assetlinks.json valide
- une signature Android correspondante
- un manifeste correct
- une application installée
- la validation Android des App Links

La configuration du domaine dans Vercel ne suffit pas à elle seule.

## 8. Important

Ne pas modifier les DNS ou les redirections Vercel pour résoudre
un problème de callback Android.

Le domaine TechPro est :

https://techpro.phenixconnect.online/
