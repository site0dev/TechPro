# SMTP LWS — TechPro

1. Sur l'hébergement LWS, utilisez PHP 8.1+ et Composer (ou installez PHPMailer localement avec `composer install --no-dev` dans `server/`).
2. Déployez `server/send-mail.php` et `server/vendor/` sur le serveur PHP. Ne déployez jamais `SMTP_PASSWORD` dans le frontend.
3. Configurez les variables d'environnement du serveur :
   - `SMTP_HOST` : serveur SMTP indiqué dans l'espace client LWS (souvent `mail.phenixconnect.online`, à confirmer dans LWS)
   - `SMTP_PORT` : `587` avec STARTTLS (ou port/sécurité exacts indiqués par LWS)
   - `SMTP_USER` : `contact@phenixconnect.online`
   - `SMTP_PASSWORD` : mot de passe de la boîte mail
   - `TECHPRO_ALLOWED_ORIGIN` : URL exacte du site TechPro, par ex. `https://phenixconnect.online`
4. Endpoint : `https://VOTRE-DOMAINE/server/send-mail.php` (POST JSON `{ "to":"...", "subject":"...", "message":"..." }`).
5. Ajoutez une authentification applicative/jeton et une limite de débit avant d'exposer l'endpoint en production. CORS seul n'est pas une protection. Ne fournissez pas le mot de passe SMTP au navigateur.

Le nom du serveur et le port doivent être confirmés dans le panneau LWS de la boîte mail; ne pas supposer que le hostname par défaut ci-dessus est exact.
