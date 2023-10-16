import { db } from '@/utils/firebase.ts';
import {
	collection,
	doc,
	DocumentData,
	FirestoreDataConverter,
	getDoc,
	getDocs,
	query,
	QueryConstraint,
	setDoc,
	where,
	WithFieldValue,
} from 'firebase/firestore';
import { ref } from 'vue';

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
					if(snapshot.empty) {
						resolve([] as T[]);
					} else {
						resolve(snapshot.docs.map((doc) => doc.data()) as T[]);
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
			? docSnap.data()
			: null;
	}
	
	async function getBy<T>(searchQuery: QueryConstraint): Promise<T[]> {
		console.log(`From API: getBy (${collectionName})`);
		
		loading.value = true;
		return new Promise((resolve, reject) => {
			const collectionRef = collection(db, collectionName).withConverter(getConverter<T>());
			const collectionQuery = query(collectionRef, where('user_uuid', '==', 'user-uuid'), searchQuery);
			getDocs(collectionQuery)
				.then((snapshot) => {
					if(snapshot.empty) {
						resolve([] as T[]);
					} else {
						resolve(snapshot.docs.map((doc) => doc.data()) as T[]);
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
		
		const collectionRef = collection(db, collectionName).withConverter(getConverter<T>());
		const elementRef = doc(collectionRef);
		await setDoc(elementRef, element);
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