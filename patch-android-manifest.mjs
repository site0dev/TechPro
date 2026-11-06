import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const manifestPath = resolve(
  'android', 'app', 'src', 'main', 'AndroidManifest.xml'
);
let xml = await readFile(manifestPath, 'utf8');

if (xml.includes('android:scheme="techpro"')) {
  console.log('Lien profond techpro:// déjà configuré.');
  process.exit(0);
}

const activityPattern = /(<activity\b(?=[^>]*android:name="[^"]*MainActivity")[\s\S]*?)(\s*<\/activity>)/;
if (!activityPattern.test(xml)) {
  throw new Error('Activité MainActivity introuvable dans AndroidManifest.xml.');
}

const intentFilter = `
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="techpro" android:host="auth" android:pathPrefix="/callback" />
            </intent-filter>`;

xml = xml.replace(activityPattern, `$1${intentFilter}$2`);
await writeFile(manifestPath, xml, 'utf8');
console.log('Lien profond techpro://auth/callback ajouté.');
