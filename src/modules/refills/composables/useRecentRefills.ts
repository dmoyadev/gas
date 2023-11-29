import { useDB } from '@/modules/app/composables/useDB.ts';
import { ref, watch } from 'vue';
import { Refill } from '@/modules/refills/models/Refill.ts';
import { limit, orderBy, where } from 'firebase/firestore';
import { useSelectedVehicle } from '@/modules/vehicles/composables/useSelectedVehicle.ts';
import { useRoute } from "vue-router";

const refills = ref<Refill[]>([]);
export function useRecentRefills() {
	const { vehicle } = useSelectedVehicle();
	
	const {
		getBy,
		error,
		loading: loadingRefills,
	} = useDB('refills');
	const emptyLoading = ref(false);
	
	function getRecentRefills() {
		if(!vehicle.value) { return; }
		
		loadingRefills.value = true;
		
		try {
			const vehicleQuery = where('idVehicle', '==', vehicle.value.id);
			const orderByQuery = orderBy('created_at', 'desc');
			const limitQuery = limit(5);
			getBy<Refill>(vehicleQuery, orderByQuery, limitQuery)
				.then((data) => {
					if (data.length) {
						refills.value = data;
					} else {
						emptyLoading.value = true;
						setTimeout(() => {
							emptyLoading.value = false;
							refills.value = [];
						}, 300);
					}
				})
				.catch((err) => {
					error.value = err;
				})
				.finally(() => {
					loadingRefills.value = false;
				});
		} catch(err) {
			error.value = err;
		}
	}
	
	watch(vehicle, (value) => {
		if (!value) { return; }
		if (!refills.value.length) {
			getRecentRefills();
		}
	}, { immediate: true });
	
	const route = useRoute();
	watch(() => route.query.refill_success, (value, oldValue) => {
		if(!value || value === oldValue) { return; }
		getRecentRefills();
	}, { immediate: true });
	
	return {
		refills,
		loadingRefills,
		emptyLoading,
		error,
	};
}