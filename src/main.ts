import { createApp } from 'vue';
import App from './App.vue';

/* Icons */
// import './icons';

/* Theme variables */
// import './theme/variables.css';
// import './theme/colors-brand.scss';
// import './theme/colors-issues.scss';
// import './theme/colors-semantic.scss';
// import './theme/skeleton.scss';

/* Create the app itself */
import router from './router';
import i18n from './i18n';

const app = createApp(App)
    .use(router)
    .use(i18n)
;

/* Create the router and mount the app */
router.isReady()
    .then(async () => {
        app.mount('#app');
    });
