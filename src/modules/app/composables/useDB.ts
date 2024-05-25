import type {
	DocumentData,
	FirestoreDataConverter,
	QueryConstraint,
	WithFieldValue,
} from 'firebase/firestore';
import {
	Timestamp,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import { ref } from 'vue';
import { db } from '@/utils/firebase.ts';
import { useAuthentication } from '@/modules/auth/composables/useAuthentication.ts';

export function useDB(collectionName: string) {
	const loading = ref(false);
	const error = ref();

	function getConverter<T>() {
		const converter: FirestoreDataConverter<T> = {
			toFirestore: (element: any): DocumentData => ({ ...element }),
			fromFirestore: (snapshot: any, options: any) => ({ ...snapshot.data(options) }),
		};
		return converter;
	}

	async function getAll<T>(): Promise<T[]> {
		console.log(`From API: getAll (${collectionName})`);

		loading.value = true;
		return new Promise((resolve, reject) => {
			const collectionRef = collection(db, collectionName).withConverter(getConverter<T>());
			getDocs(collectionRef)
				.then((snapshot) => {
					if (snapshot.empty) {
						resolve([] as T[]);
					} else {
						resolve(snapshot.docs.map((doc) => {
							return {
								...doc.data(),
								id: doc.id,
							};
						}) as T[]);
					}
				})
				.catch((error) => {
					reject(error);
				})
				.finally(() => loading.value = false);
		});
	}

	async function get<T>(id: string) {
		console.log(`From API: get (${collectionName})`);

		const docRef = doc(db, collectionName, id).withConverter(getConverter<T>());
		const docSnap = await getDoc(docRef);
		return docSnap.exists()
			? {
					...docSnap.data(),
					id: docSnap.id,
				}
			: null;
	}

	async function getBy<T>(...searchQueries: QueryConstraint[]): Promise<T[]> {
		console.log(`From API: getBy (${collectionName})`);

		const { user } = useAuthentication();

		loading.value = true;
		return new Promise((resolve, reject) => {
			const collectionRef = collection(db, collectionName).withConverter(getConverter<T>());
			const collectionQuery = query(collectionRef, where('user_uuid', '==', user.value?.uid), ...searchQueries);
			getDocs(collectionQuery)
				.then((snapshot) => {
					if (snapshot.empty) {
						resolve([] as T[]);
					} else {
						resolve(snapshot.docs.map((doc) => {
							return {
								...doc.data(),
								id: doc.id,
							};
						}) as T[]);
					}
				})
				.catch((error) => {
					reject(error);
				})
				.finally(() => loading.value = false);
		});
	}

	async function create<T>(element: WithFieldValue<T>) {
		console.log(`From API: create (${collectionName})`);
		const { user } = useAuthentication();

		const collectionRef = collection(db, collectionName).withConverter(getConverter<T>());
		const elementRef = doc(collectionRef);
		if (typeof element === 'object') {
			const date: Timestamp = Timestamp.now();
			await setDoc(elementRef, {
				...element,
				user_uuid: user.value?.uid,
				created_at: date,
				updated_at: date,
			});
		}
	}

	return {
		loading,
		error,
		getAll,
		get,
		getBy,
		create,
	};
}
