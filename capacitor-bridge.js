import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';

const isNative = Capacitor.isNativePlatform();

// Pont utilisé par index.html. Le paiement est ouvert dans le navigateur
// sécurisé du système, puis le statut est relu dans Supabase au retour.
window.TechProNative = {
  isNative,
  openExternal: async (url) => {
    if (!/^https:\/\//i.test(String(url))) throw new Error('URL externe non sécurisée.');
    if (isNative) return Browser.open({ url: String(url), presentationStyle: 'popover' });
    window.location.assign(String(url));
  }
};

if (isNative) {
  App.addListener('appStateChange', ({ isActive }) => {
    if (isActive) window.dispatchEvent(new Event('techpro:app-resumed'));
  });

  App.addListener('appUrlOpen', ({ url }) => {
    window.dispatchEvent(new CustomEvent('techpro:app-url-open', { detail: { url } }));
  });
}
