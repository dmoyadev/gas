import type { I18nOptions } from 'vue-i18n';
import { createI18n } from 'vue-i18n';
import messages from '@intlify/unplugin-vue-i18n/messages';

const i18nOptions: I18nOptions = {
	legacy: false,
	globalInjection: true,
	/*
	 * "navigator.language" will cause a fallback warning in the JS console due to "navigator.language"
	 * being i.e. 'es-ES' and fall backing into 'es'.
	 * See https://kazupon.github.io/vue-i18n/guide/fallback.html#implicit-fallback-using-locales for details
	 */
	locale: navigator.language.substring(0, 2) || import.meta.env.VITE_I18N_LOCALE || 'es',
	fallbackLocale: [ import.meta.env.VITE_I18N_FALLBACK_LOCALE, 'es' ],
	formatFallbackMessages: true, // See details of the fallback interpolation here https://kazupon.github.io/vue-i18n/guide/fallback.html#fallback-interpolation
	silentFallbackWarn: true,
	availableLocales: [ 'es' ],
	messages,
};

export default createI18n(i18nOptions);
