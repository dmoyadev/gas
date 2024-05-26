import { ref } from 'vue';
import { where } from 'firebase/firestore';
import { useDB } from '@/modules/app/composables/useDB.ts';
import type { Vehicle } from '@/modules/app/models/Vehicle.ts';

const vehicle = ref<Vehicle>();
const hasBeenCalled = ref(false);
export function useSelectedVehicle() {
	const {
		getBy,
		error,
		loading: loadingVehicle,
		upsert,
	} = useDB('vehicles');

	const emptyLoading = ref(false);
	if (!hasBeenCalled.value && !vehicle.value) {
		loadingVehicle.value = true;
		hasBeenCalled.value = true;
		getBy<Vehicle>(where('selected', '==', true))
			.then((data) => {
				if (data.length) {
					vehicle.value = data[0];
				} else {
					emptyLoading.value = true;
					setTimeout(() => {
						emptyLoading.value = false;
						vehicle.value = undefined;
					}, 300);
				}
			})
			.catch((err) => {
				error.value = err;
			})
			.finally(() => {
				loadingVehicle.value = false;
				hasBeenCalled.value = false;
			});
	}

	async function updateVehicle(data: Vehicle) {
		if (!vehicle.value) {
			return;
		}

		await upsert<Vehicle>(data, vehicle.value.id);
		vehicle.value = data;
	}

	return {
		vehicle,
		loadingVehicle,
		error,
		emptyLoading,
		updateVehicle,
	};
}
