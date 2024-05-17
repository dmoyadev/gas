import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import mkcert from 'vite-plugin-mkcert';

// Vite configuration
export default defineConfig({
	plugins: [
		vue(), // Use the Vue.js plugin
		mkcert(), // Use mkcert for enabling HTTPS in localhost
	],

	resolve: {
		alias: {
			'~': resolve(__dirname, 'src'), // Set an alias for the 'src' directory
			'@': resolve(__dirname, 'src'), // Set an alias for the 'src' directory
		},
	},

	build: {
		target: 'esnext', // Use the latest ECMAScript standard
	},
});
