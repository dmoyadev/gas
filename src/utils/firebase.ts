import { initializeApp, FirebaseApp } from 'firebase/app';
import { getMessaging, Messaging } from 'firebase/messaging';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
let messaging: Messaging;
let auth: Auth;
let db: Firestore;

try {
	firebaseApp = initializeApp({
		apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
		authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
		databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
		projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
		storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
		appId: import.meta.env.VITE_FIREBASE_APP_ID,
		measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
	});

	messaging = getMessaging(firebaseApp);
	auth = getAuth(firebaseApp);
	db = getFirestore(firebaseApp);
} catch(error) {
	console.error('🔴 Something went wrong: ', error);
}

export {
	firebaseApp,
	messaging,
	auth,
	db,
};
