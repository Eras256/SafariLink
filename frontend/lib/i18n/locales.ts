/**
 * Internationalization (i18n) Support
 * SafariLink supports multiple languages with focus on African languages
 */

export type Locale = 'en' | 'sw' | 'fr';

export const supportedLocales: Locale[] = ['en', 'sw', 'fr'];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  sw: 'Kiswahili',
  fr: 'Français',
};

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.hackathons': 'Hackathons',
    'nav.projects': 'Projects',
    'nav.grants': 'Grants',
    'nav.learn': 'Learn',
    'nav.dao': 'DAO',
    'hero.title': 'The Complete Web3 Hackathon Lifecycle Platform',
    'hero.subtitle': 'From First Hack to Global Funding – Optimized for Africa & Emerging Markets',
    'hero.cta.start': 'Start Building',
    'hero.cta.explore': 'Explore Hackathons',
    'features.networking': 'Virtual Networking',
    'features.mentor': 'AI Mentor',
    'features.dashboard': 'Organizer Dashboard',
    'features.feedback': 'Real-time Feedback',
    'features.team': 'Smart Team Matching',
    'features.gamification': 'Gamification',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
  },
  sw: {
    'nav.home': 'Nyumbani',
    'nav.hackathons': 'Hackathons',
    'nav.projects': 'Miradi',
    'nav.grants': 'Ruzuku',
    'nav.learn': 'Jifunze',
    'nav.dao': 'DAO',
    'hero.title': 'Jukwaa la Kamili la Web3 Hackathon Lifecycle',
    'hero.subtitle': 'Kutoka Hack ya Kwanza hadi Uwekezaji wa Kimataifa – Imeboreshwa kwa Afrika na Masoko Yanayoendelea',
    'hero.cta.start': 'Anza Kujenga',
    'hero.cta.explore': 'Gundua Hackathons',
    'features.networking': 'Networking ya Virtual',
    'features.mentor': 'Mentor wa AI',
    'features.dashboard': 'Dashibodi ya Mratibu',
    'features.feedback': 'Maoni ya Wakati Halisi',
    'features.team': 'Kupatanisha Timu Kwa Akili',
    'features.gamification': 'Mchezo',
    'common.loading': 'Inapakia...',
    'common.error': 'Hitilafu',
    'common.success': 'Mafanikio',
    'common.save': 'Hifadhi',
    'common.cancel': 'Ghairi',
    'common.submit': 'Wasilisha',
    'common.delete': 'Futa',
    'common.edit': 'Hariri',
    'common.close': 'Funga',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.hackathons': 'Hackathons',
    'nav.projects': 'Projets',
    'nav.grants': 'Subventions',
    'nav.learn': 'Apprendre',
    'nav.dao': 'DAO',
    'hero.title': 'Plateforme Complète du Cycle de Vie des Hackathons Web3',
    'hero.subtitle': 'Du Premier Hack au Financement Mondial – Optimisé pour l\'Afrique et les Marchés Émergents',
    'hero.cta.start': 'Commencer à Construire',
    'hero.cta.explore': 'Explorer les Hackathons',
    'features.networking': 'Networking Virtuel',
    'features.mentor': 'Mentor IA',
    'features.dashboard': 'Tableau de Bord Organisateur',
    'features.feedback': 'Retour en Temps Réel',
    'features.team': 'Appariement Intelligent d\'Équipes',
    'features.gamification': 'Gamification',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.submit': 'Soumettre',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.close': 'Fermer',
  },
};

export function getTranslation(locale: Locale, key: string): string {
  return translations[locale]?.[key] || translations.en[key] || key;
}

export function getCurrentLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('locale') as Locale;
  return stored && supportedLocales.includes(stored) ? stored : 'en';
}

export function setLocale(locale: Locale): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
  }
}

