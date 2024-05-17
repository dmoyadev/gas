import type { Composer } from 'vue-i18n';
import { createI18n } from 'vue-i18n';
import { nextTick } from 'vue';
import type SPANISH_MESSAGES from './locales/es.json';

export const SUPPORTED_LOCALES = ['es', 'en'] as const;

type MessageSchema = typeof SPANISH_MESSAGES;

function getDefaultLocale() {
	const savedLocale = localStorage.getItem('locale');
	const browserLocale = navigator.language.substring(0, 2);
	const envVariableLocale = import.meta.env.VITE_I18N_LOCALE as string;

	return savedLocale || browserLocale || envVariableLocale || 'es';
}

export const i18n = createI18n<[MessageSchema], typeof SUPPORTED_LOCALES[number]>({
	legacy: false,
	globalInjection: true,

	/*
	 * "navigator.language" will cause a fallback warning in the JS console due to "navigator.language"
	 * being for example 'es-ES' and fall backing into 'es'.
	 * @see https://vue-i18n.intlify.dev/guide/essentials/fallback.html
	 */
	locale: getDefaultLocale(),
	fallbackLocale: [import.meta.env.VITE_I18N_FALLBACK_LOCALE, 'es'],
	formatFallbackMessages: true, /* Allows the actual keys to be the fallback translation if it does not exist */
	fallbackWarn: false,

	availableLocales: [...SUPPORTED_LOCALES],
});
await changeLocale(getDefaultLocale() as typeof SUPPORTED_LOCALES[number]);

export async function changeLocale(locale: typeof SUPPORTED_LOCALES[number]) {
	// load locale messages with dynamic import
	const messages = await import(`./locales/${locale}.json`)
		.then((r: { default: typeof SPANISH_MESSAGES }) => r.default);

	// set locale and locale message
	(i18n.global as unknown as Composer).locale.value = locale;
	i18n.global.setLocaleMessage(locale, messages);
	localStorage.setItem('locale', locale);
	document.querySelector('html')!.setAttribute('lang', locale);

	return nextTick();
}
