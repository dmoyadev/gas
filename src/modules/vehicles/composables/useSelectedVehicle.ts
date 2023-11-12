import { useDB } from '@/modules/app/composables/useDB.ts';
import { ref } from 'vue';
import { Vehicle } from '@/modules/app/models/Vehicle.ts';
import { where } from 'firebase/firestore';

const vehicle = ref<Vehicle>();
export function useSelectedVehicle() {
	const { getBy, error, loading } = useDB('vehicles');
	
	const emptyLoading = ref(false);
	if(!vehicle.value) {
		console.log('Getting vehicle!');
		getBy<Vehicle>(where('selected', '==', true))
			.then((vehicles) => {
				if (vehicles.length) {
					vehicle.value = vehicles[0];
				} else {
					emptyLoading.value = true;
					setTimeout(() => {
						emptyLoading.value = false;
						vehicle.value = undefined;
					}, 300);
				}
			});
	}
	
	return {
		vehicle,
		loading,
		error,
		emptyLoading,
	};
}