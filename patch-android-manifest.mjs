import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const manifestPath = resolve('android', 'app', 'src', 'main', 'AndroidManifest.xml');
let xml = await readFile(manifestPath, 'utf8');
const activityPattern = /(<activity\b(?=[^>]*android:name="[^"]*MainActivity")[\s\S]*?)(\s*<\/activity>)/;
if (!activityPattern.test(xml)) throw new Error('Activité MainActivity introuvable dans AndroidManifest.xml.');
const activity = xml.match(activityPattern)[0];
const filters = `\n            <intent-filter>\n                <action android:name="android.intent.action.VIEW" />\n                <category android:name="android.intent.category.DEFAULT" />\n                <category android:name="android.intent.category.BROWSABLE" />\n                <data android:scheme="techpro" android:host="auth" android:pathPrefix="/callback" />\n            </intent-filter>\n            <intent-filter android:autoVerify="true">\n                <action android:name="android.intent.action.VIEW" />\n                <category android:name="android.intent.category.DEFAULT" />\n                <category android:name="android.intent.category.BROWSABLE" />\n                <data android:scheme="https" android:host="techpro.phenixconnect.online" android:pathPrefix="/auth/callback" />\n            </intent-filter>`;
let updated = activity;
if (!updated.includes('android:scheme="techpro"')) updated = updated.replace(/(\s*<\/activity>)/, `${filters}$1`);
else if (!updated.includes('android:autoVerify="true"')) updated = updated.replace(/(\s*<\/activity>)/, `${filters.split('            <intent-filter>')[2] ? '' : ''}${filters.slice(filters.indexOf('<intent-filter android:autoVerify'))}$1`);
xml = xml.replace(activity, updated);
await writeFile(manifestPath, xml, 'utf8');
console.log('Liens profonds techpro://auth/callback et App Link HTTPS TechPro configurés.');
