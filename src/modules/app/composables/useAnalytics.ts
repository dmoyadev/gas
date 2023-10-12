import { getAnalytics, logEvent, setUserId } from 'firebase/analytics';
import { firebaseApp } from '@/utils/firebase';
import * as pkg from '@/../package.json';

export interface AnalyticsUser {
	email: string | null;
	name: string | null;
}

const analytics = getAnalytics(firebaseApp);

/**
 * Composable to manage analytics
 *
 * @example
 * const { sendEvent, sendUser } = useAnalytics();
 *
 * sendEvent('custom_event_name', { custom_param: 'value' });
 * sendUser('user_email', 'user_name', ['user_roles'], 'user_language');
 */
export function useAnalytics() {
	/**
	 * Logs an event
	 * @param {string} name The event custom name
	 * @param {Record<string, unknown>} params Custom params sent with the event
	 */
	function sendEvent(name: string, params: Record<string, unknown> = {}) {
		params.version = pkg.version;

		if(import.meta.env.VITE_FAKE_METRICS === 'true') {
			console.log('ℹ️ Event log faked: ', {
				name,
				params,
			});
			return;
		}

		logEvent(analytics, name, params);
	}

	/**
	 * Registers what user is the one using the application
	 * @param {AnalyticsUser} user User data
	 */
	function sendUser({ email, name }: AnalyticsUser) {
		if(import.meta.env.VITE_FAKE_METRICS === 'true') {
			console.error('ℹ️ User log faked: ', {
				email,
				name,
			});
			return;
		}

		if (!email) {
			console.log('🔴 User log failed because no email found: ', {
				email,
				name,
			});
			return;
		}

		setUserId(analytics, email);
	}

	return {
		sendEvent,
		sendUser,
	};
}
