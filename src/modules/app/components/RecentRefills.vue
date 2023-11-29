<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDB } from '@/modules/app/composables/useDB.ts';
import { Vehicle, VehicleFuelType } from '@/modules/app/models/Vehicle.ts';
import {
	where,
	orderBy,
	limit,
} from 'firebase/firestore';
import { Refill } from '@/modules/refills/models/Refill.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/types.ts';
import BaseButton from '@/components/button/BaseButton.vue';
import RecentRefillItem from '@/modules/app/components/RecentRefillItem.vue';

const props = defineProps<{
	vehicle?: Vehicle
}>();

const {
	getBy,
	error,
	loading,
} = useDB('refills');
const refills = ref<Refill[]>();
loading.value = true;

const emptyLoading = ref(false);
watch(() => props.vehicle, (value) => {
	if(!value) { return; }
	
	loading.value = false;
	try {
		const vehicleQuery = where('idVehicle', '==', value.id);
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
			});
	} catch(err) {
		error.value = err;
	}
}, { immediate: true });

const emptyRefillsText = computed<string>(() => {
	if(!props.vehicle) { return ''; }
	
	switch(props.vehicle?.fuelType) {
		case VehicleFuelType.GASOLINE:
		case VehicleFuelType.DIESEL:
			return 'los últimos repostajes';
		case VehicleFuelType.ELECTRIC:
			return 'las últimas recargas';
		default:
			return 'los últimos suministros';
	}
});
const refillsText = computed<string>(() => {
	if(!props.vehicle) { return ''; }
	
	switch(props.vehicle?.fuelType) {
		case VehicleFuelType.GASOLINE:
		case VehicleFuelType.DIESEL:
			return 'Últimos repostajes';
		case VehicleFuelType.ELECTRIC:
			return 'Últimas recargas';
		default:
			return 'Últimos suministros';
	}
});
</script>

<template>
	<!-- ⏳ Loading state -->
	<section v-if="loading">
		<span
			class="skeleton-item"
			style="width: 25ch;"
		/>
		
		<ul>
			<RecentRefillItem
				v-for="n in 5"
				:key="n"
				loading
			/>
		</ul>
	</section>
	
	<!-- 🚨 Error state -->
	<section
		v-else-if="error"
		class="error-state"
	>
		<BaseIcon
			icon="fa-solid fa-warning"
			:icon-size="IconSize.XL"
		/>
		
		<p>
			Ha habido un problema con {{ emptyRefillsText }}.
			<br>
			<br>
			Vuelve a intentarlo más tarde.
		</p>
	</section>
	
	<!-- 📃 Empty state -->
	<section
		v-else-if="!refills?.length"
		class="empty-state"
	>
		<BaseIcon
			:icon="vehicle?.fuelType === VehicleFuelType.ELECTRIC 
				? 'fa-solid fa-charging-station' 
				: 'fa-solid fa-gas-pump'"
			:icon-size="IconSize.XL"
		/>
		
		<p>
			Aquí aparecerán {{ emptyRefillsText }} que le hayas hecho a tu vehículo,
			<br>
			¿Por qué no pruebas a añadir uno?
		</p>
		
		<BaseButton
			:to="`/vehicles/${vehicle?.id}/refill`"
		>
			Añadir repostaje
		</BaseButton>
	</section>
	
	<!-- ✅ Success state -->
	<section v-else>
		<h2>
			<BaseIcon
				:icon="vehicle?.fuelType === VehicleFuelType.ELECTRIC
					? 'fa-solid fa-charging-station'
					: 'fa-solid fa-gas-pump'"
				:icon-size="IconSize.M"
			/>
			{{ refillsText }}
		</h2>
		
		<ul>
			<RecentRefillItem
				v-for="(refill, index) in refills"
				:key="index"
				:refill="refill"
				:previous-odometer="refills[index - 1]?.odometer"
			/>
		</ul>
	</section>
</template>

<style lang="scss" scoped>
section {
	display: flex;
	flex-direction: column;
	gap: 16px;
	
	&.empty-state,
	&.error-state {
		align-items: center;
		justify-content: center;
		text-align: center;
		
		p {
			font-weight: var(--font-light);
		}
	}
	
	h2 {
		display: flex;
		align-items: center;
		gap: 4px;
		font-weight: var(--font-heavy);
		font-size: var(--font-size-body);
	}
	
	ul {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
}
</style>