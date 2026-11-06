TECHPRO — CORRECTION DE LA PERSISTANCE DE CONNEXION

Fichiers à remplacer dans le dépôt GitHub :
- index.html (racine)
- src/capacitor-bridge.js (dans le dossier src)

Aucune dépendance supplémentaire n’est nécessaire. Ne remplacez PAS package.json : la correction utilise le stockage local persistant du WebView Android via localStorage, explicitement configuré dans Supabase Auth.

Après remplacement : committez les deux fichiers, puis relancez Codemagic pour générer un nouvel APK. Installez-le par-dessus l’ancienne version sans désinstaller celle-ci.

La session existante utilise la clé de stockage Supabase par défaut du projet : les sessions déjà enregistrées ne sont pas volontairement renommées ni supprimées.
