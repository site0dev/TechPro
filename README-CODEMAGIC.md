# TechPro — signature Android Codemagic

## Fichier
- `TechPro-release.jks` — keystore Android à importer dans Codemagic.

## Valeurs à saisir dans Codemagic

Dans **Team/Personal settings → Code signing identities → Android keystores → Add** :

- **Keystore file** : `TechPro-release.jks`
- **Keystore password** : `TechPro-2026!Phenix`
- **Key alias** : `techpro`
- **Key password** : `TechPro-2026!Phenix`
- **Reference name** : `techpro_keystore`

Les mots de passe du keystore et de la clé sont identiques.

## Important — sécurité et compatibilité

- Ce keystore est une clé nouvellement créée. Il ne correspond pas automatiquement à la clé ayant signé l'APK TechPro déjà installé.
- Pour les versions futures, conserver ce même fichier et configurer Codemagic pour utiliser ce keystore à chaque build.
- Ne pas téléverser ce fichier ni les mots de passe dans un dépôt GitHub public, ne pas les partager et conserver une copie de sauvegarde sécurisée.
- Le mot de passe est inclus dans ce README à la demande; considérez-le comme exposé. Avant une distribution publique, changez les mots de passe ou créez un keystore de production sécurisé, puis mettez à jour les valeurs dans Codemagic.
- Si l'APK installé a une autre signature, Android peut refuser la mise à jour. Il faudra retrouver la clé originale ou désinstaller l'ancienne application (ce qui peut supprimer ses données).

## Configuration YAML (référence)

Dans le workflow Android existant de `codemagic.yaml`, la référence de signature doit être disponible sous `environment` :

```yaml
environment:
  android_signing:
    - techpro_keystore
```

Ne remplacez pas tout le fichier `codemagic.yaml` par cet extrait : ajoutez-le à la configuration existante et vérifiez que la tâche Gradle signe bien la variante release avec les variables de signature Codemagic.
