import {
	createRouter,
	createWebHistory,
	RouteLocationNormalized,
	RouteRecordRaw,
} from 'vue-router';
import { authRoutes } from '@/modules/auth/router.ts';
import { useAuthentication } from '@/modules/auth/composables/useAuthentication.ts';
import i18n from '@/i18n';

const { t } = i18n.global;

const routes: Array<RouteRecordRaw> = [
	...authRoutes,
	
	{
		path: '/',
		name: 'Tabs',
		component: () => import('@/layouts/TabsLayout.vue'),
		children: [
			{
				path: '/',
				name: 'Home',
				component: () => import('@/modules/app/pages/HomePage.vue'),
				meta: { title: t('Home') },
			},
			{
				path: '/management',
				name: 'Management',
				component: () => import('@/modules/management/pages/ManagementPage.vue'),
				meta: { title: t('Management') },
			},
			{
				path: '/history',
				name: 'History',
				component: () => import('@/modules/history/pages/HistoryPage.vue'),
				meta: { title: t('History') },
			},
			{
				path: '/settings',
				name: 'Settings',
				component: () => import('@/modules/settings/pages/SettingsPage.vue'),
				meta: { title: t('Settings') },
			},
		],
	},
	
	{
		path: '/vehicles/__new__',
		name: 'Vehicle',
		component: () => import('@/modules/management/pages/CreateVehiclePage.vue'),
		meta: { title: 'Nuevo vehículo' },
	},
	
	{
		path: '/vehicles/:id/success',
		name: 'Vehicle Creation Success',
		component: () => import('@/modules/management/pages/CreateVehicleSuccessPage.vue'),
		meta: { title: 'Vehículo creado' },
	},
 
	{
		path: '/showcase',
		name: 'Showcase',
		component: () => import('@/showcase/ShowcasePage.vue'),
		meta: {
			title: t('Showcase'),
			isPublic: true,
		},
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(async (to) => {
	setDocumentTitle(to);
    
	// TODO - This is a workaround for the firebase auth state change delay
	const { loading, user } = useAuthentication();
	if(!user.value) {
		while (loading.value) {
			await new Promise((resolve) => setTimeout(resolve, 50));
		}
	}
    
	// Avoid the user going a public route when logged in
	if(to.meta.isPublic && user.value) {
		if(!to.query.redirect) {
			return '/';
		}
        
		return to.query.redirect as string;
	}
    
	// If the route is not public and the user is not logged in, get the user out
	const isNotAllowed = !to.meta.isPublic && !user.value;
	if (isNotAllowed && to.name !== 'Logout') {
		console.error('🔴 User can not be here!');
		if(to.fullPath === '/') {
			window.location.href = '/logout';
		} else {
			window.location.href = '/logout?redirect=' + to.fullPath;
		}
	}
});

/**
 * Set the document title with the app title as suffix and
 * adding the id to the title if it's a dynamic route.
 *
 * @param {RouteLocationNormalized} to - The route to which we are navigating
 */
function setDocumentTitle(to: RouteLocationNormalized) {
	const appTitle = 'Gas! 🏎️';
	const titleSuffix = (import.meta.env.VITE_ENV_NAME && import.meta.env.MODE !== 'production')
		? (' ' + (import.meta.env.VITE_ENV_NAME || import.meta.env.MODE).toUpperCase())
		: '';
	document.title = `${to.meta?.title} | ${appTitle}${titleSuffix}`;
	document.title = document.title.replace('{id}', '#' + to.params.id);
}

export default router;
