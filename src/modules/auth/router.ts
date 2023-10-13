import { RouteRecordRaw } from 'vue-router';
import i18n from '@/i18n';
import { useAuthentication } from '@/modules/auth/composables/useAuthentication.ts';

const { t } = i18n.global;

export const authRoutes: Array<RouteRecordRaw> = [
	{
		path: '/sign-in',
		name: 'Sign in',
		component: () => import('@/modules/auth/pages/SignInPage.vue'),
		meta: {
			title: t('Sign in'),
			isPublic: true,
		},
		beforeEnter: async () => {
			await useAuthentication().checkUserLogin();
		},
	},
	
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/modules/auth/pages/SignInPage.vue'),
		meta: {
			title: t('Login'),
			isPublic: true,
		},
		beforeEnter: async () => {
			await useAuthentication().checkUserLogin();
		},
	},

	{
		path: '/logout',
		name: 'Logout',
		component: () => import('@/modules/auth/pages/SignInPage.vue'),
		meta: { title: t('Logout') },
		beforeEnter: (to) => {
			window.location.href = `/sign-in${to.query?.redirect ? ('?redirect=' + to.query.redirect) : ''}`;
		},
	},
];
