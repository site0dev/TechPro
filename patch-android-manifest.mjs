
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const manifestPath = resolve(
  'android',
  'app',
  'src',
  'main',
  'AndroidManifest.xml'
);

let xml = await readFile(manifestPath, 'utf8');

// Vérifier que le manifeste Android existe et contient MainActivity.
const activityPattern =
  /<activity\b(?=[^>]*android:name="[^"]*MainActivity")[\s\S]*?<\/activity>/;

const activityMatch = xml.match(activityPattern);

if (!activityMatch) {
  throw new Error(
    'Activité MainActivity introuvable dans AndroidManifest.xml.'
  );
}

let activity = activityMatch[0];

// Retirer les anciens filtres TechPro ajoutés par ce script.
// Cela évite les doublons lors des compilations successives.
activity = activity.replace(
  /\s*<intent-filter\b(?=[^>]*(?:android:autoVerify="true"))[\s\S]*?<\/intent-filter>/g,
  (filter) => {
    if (
      filter.includes('techpro.phenixconnect.online')
    ) {
      return '';
    }

    return filter;
  }
);

activity = activity.replace(
  /\s*<intent-filter\b[\s\S]*?<\/intent-filter>/g,
  (filter) => {
    if (
      filter.includes('android:scheme="techpro"') &&
      filter.includes('android:host="auth"')
    ) {
      return '';
    }

    return filter;
  }
);

// Liens profonds internes TechPro.
const customSchemeFilter = `
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />

                <data
                    android:scheme="techpro"
                    android:host="auth"
                    android:pathPrefix="/callback" />
            </intent-filter>`;

// App Links HTTPS vérifiés par Android.
const appLinkFilter = `
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />

                <data
                    android:scheme="https"
                    android:host="techpro.phenixconnect.online"
                    android:pathPrefix="/auth/callback" />
            </intent-filter>`;

// Ajouter les filtres avant la fermeture de MainActivity.
activity = activity.replace(
  '</activity>',
  `${customSchemeFilter}
${appLinkFilter}
        </activity>`
);

// Remplacer MainActivity dans le manifeste.
xml = xml.replace(activityMatch[0], activity);

// Enregistrer le manifeste modifié.
await writeFile(manifestPath, xml, 'utf8');

console.log(
  'Liens TechPro configurés : techpro://auth/callback et HTTPS /auth/callback.'
);
