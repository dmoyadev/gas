import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import mkcert from 'vite-plugin-mkcert';

// Vite configuration
export default defineConfig({
	plugins: [
		vue(), // Use the Vue.js plugin
		VueI18nPlugin({ include: resolve(__dirname, 'src/i18n/locales/**') }), // Use Vue I18n plugin with specified locales path
		mkcert(), // Use mkcert for enabling HTTPS in localhost
	],
    
	resolve: {
		alias: {
			'~': resolve(__dirname, 'src'), // Set an alias for the 'src' directory
			'@': resolve(__dirname, 'src'), // Set an alias for the 'src' directory
		},
	},
});
