export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
const destination = (value: unknown, fallback: string) => typeof value === 'string' && /^(https?:\/\/|\/(?!\/)|#|mailto:)/.test(value.trim()) ? value.trim() : fallback;
export const siteConfig = {
  name: 'KenkoBuddy',
  url: destination(import.meta.env.VITE_SITE_URL, ''),
  description: 'Bring movement, nutrition, hydration, sleep, recovery, and personalized AI wellness guidance together with KenkoBuddy.',
  routes: {
    login: destination(import.meta.env.VITE_LOGIN_URL, '#access'),
    signup: destination(import.meta.env.VITE_SIGNUP_URL, '#access'),
    dashboard: destination(import.meta.env.VITE_APP_URL, '#experience'),
    privacy: destination(import.meta.env.VITE_PRIVACY_URL, '#privacy'),
    terms: destination(import.meta.env.VITE_TERMS_URL, '#terms'),
    support: destination(import.meta.env.VITE_SUPPORT_URL, '#support'),
    demo: '#experience', story: '#story', coach: '#coach', recipes: '#nutrition', exercise: '#movement', progress: '#progress',
  },
  social: [] as { label: string; href: string }[],
  disclaimer: 'KenkoBuddy provides general wellness guidance and is not a substitute for professional medical advice, diagnosis, or treatment.',
};
export const navigation = [
  { label: 'Experience', href: '#experience' }, { label: 'Coach', href: '#coach' },
  { label: 'Nutrition', href: '#nutrition' }, { label: 'Movement', href: '#movement' }, { label: 'Progress', href: '#progress' },
];
export type AnalyticsEvent = 'landing_viewed' | 'hero_cta_clicked' | 'start_free_clicked' | 'login_clicked' | 'wellness_symbol_selected' | 'scroll_chapter_reached' | 'preview_tab_changed' | 'checkin_completed' | 'coach_prompt_selected' | 'recipe_opened' | 'workout_started' | 'final_cta_clicked';
// Host app may supply its existing provider. Only public UI labels pass through this adapter.
let analytics: ((event: AnalyticsEvent, metadata?: { id: string }) => void) | undefined;
export function configureAnalytics(provider: typeof analytics) { analytics = provider; }
export function track(event: AnalyticsEvent, id?: string) { analytics?.(event, id ? { id } : undefined); }
