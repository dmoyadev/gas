import { ref } from 'vue';
import { auth } from '@/utils/firebase.ts';
import {
	sendSignInLinkToEmail,
	signInWithEmailAndPassword,
	isSignInWithEmailLink,
	signInWithEmailLink,
	onAuthStateChanged,
	signOut,
	ActionCodeSettings,
	User,
	Unsubscribe,
} from 'firebase/auth';
import router from '@/router.ts';

const user = ref<User>();
let unsubscribeAuthWatcher: Unsubscribe;

/**
 * Composable to manage authentication related data, such as the current user
 *
 * @example
 * const { user } = useAuthentication();
 */
export function useAuthentication() {
	const loading = ref(true);
 
	if(unsubscribeAuthWatcher) {
		unsubscribeAuthWatcher();
	}
	unsubscribeAuthWatcher = onAuthStateChanged(auth, async (state) => {
		if (state) {
			user.value = state;
		} else {
			user.value = undefined;
		}
		loading.value = false;
	});
    
	/**
     * Sends a sign-in link to the user's email
     * @param email The user's email
     * @returns {Promise<void>} A promise that resolves when the email is sent
     */
	async function signInWithMagicLink(email: string): Promise<void> {
		const actionCodeSettings: ActionCodeSettings = {
			url: `${window.location.origin}/login`,
			handleCodeInApp: true, // This must be true
		};
        
		return new Promise<void>((resolve, reject) => {
			sendSignInLinkToEmail(auth, email, actionCodeSettings)
				.then(async () => {
					localStorage.setItem('email', email);
					resolve();
				})
				.catch((error) => {
					console.error('🔴 Magic link could not be sent!', error);
					reject(error);
				});
		});
	}
    
	/**
     * Signs in the user with email and password
     * @param email
     * @param password
     */
	async function signInWithPassword(email: string, password: string) {
		return signInWithEmailAndPassword(auth, email, password)
			.then((result) => {
				user.value = result.user;
			})
			.catch((error) => {
				console.error('🔴 User could not login with password!', error);
			});
	}
    
	/**
     * Checks if the user is logged in via email link and logs them in
     */
	async function checkUserLogin() {
		if (isSignInWithEmailLink(auth, window.location.href)) {
			const email = localStorage.getItem('email');
			if (!email) { return; }
            
			signInWithEmailLink(auth, email as string, window.location.href)
				.then((result) => {
					localStorage.removeItem('email');
					// You can access the new user via result.user
					// Additional user info profile not available via:
					// result.additionalUserInfo.profile == null
					// You can check if the user is new or existing:
					// result.additionalUserInfo.isNewUser
					user.value = result.user;
				})
				.catch((error) => {
					console.error('🔴 Sign in link had an error!', error);
				});
		} else {
			console.log('🟢 User has not signed in with an email link');
		}
	}
    
	/**
     * Logs the user out
     */
	function logout() {
		signOut(auth)
			.then(async () => {
				await router.push('/logout');
			})
			.catch((error) => {
				console.error('🔴 Sign out threw an error!', error);
			});
	}
    
	return {
		loading,
		user,
		signInWithMagicLink,
		signInWithPassword,
		checkUserLogin,
		logout,
	};
}
