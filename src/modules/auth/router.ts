import type { RouteRecordRaw } from 'vue-router';
import { i18n } from '@/i18n';

const { t } = i18n.global;

export const authRoutes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/modules/auth/pages/LoginPage.vue'),
		meta: {
			title: t('Login'),
			isPublic: true,
		},
	},

	{
		path: '/logout',
		name: 'Logout',
		component: () => import('@/modules/auth/pages/LoginPage.vue'),
		meta: { title: t('Logout') },
		beforeEnter: (to) => {
			window.location.href = `/login${to.query?.redirect ? (`?redirect=${String(to.query.redirect)}`) : ''}`;
		},
	},
];
