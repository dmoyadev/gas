<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDB } from '@/modules/app/composables/useDB.ts';
import { Vehicle, VehicleFuelType } from '@/modules/app/models/Vehicle.ts';
import { where } from 'firebase/firestore';
import { Refill } from '@/modules/refills/models/Refill.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/types.ts';
import BaseButton from '@/components/button/BaseButton.vue';

const props = defineProps<{
	vehicle?: Vehicle
}>();

const {
	getBy,
	loading,
} = useDB('refills');
const refills = ref<Refill[]>();
loading.value = true;

const emptyLoading = ref(false);
watch(() => props.vehicle, (value) => {
	if(!value) { return; }
	
	loading.value = false;
	getBy<Refill>(where('idVehicle', '==', value.id))
		.then((data) => {
			if(data.length ) {
				refills.value = data;
			} else {
				emptyLoading.value = true;
				setTimeout(() => {
					emptyLoading.value = false;
					refills.value = [];
				}, 300);
			}
		});
}, { immediate: true });

const refillText = computed<string>(() => {
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
</script>

<template>
	<!-- ⏳ Loading state -->
	<section v-if="loading">
		<span
			class="skeleton-item"
			style="width: 25ch;"
		/>
		
		<ul>
			<li
				v-for="n in 5"
				:key="n"
			>
				<span class="skeleton-item skeleton-item--icon" />
				
				<div class="info">
					<span
						class="skeleton-item skeleton-item--small"
						style="width: 8ch;"
					/>
					<span
						class="skeleton-item skeleton-item--small"
						style="width: 15ch;"
					/>
					<span
						class="skeleton-item skeleton-item--small"
						style="width: 12ch;"
					/>
				</div>
				
				<div class="price">
					<span
						class="title"
						style="width: 8ch;"
					/>
					<span
						class="skeleton-item skeleton-item--small"
						style="width: 15ch;"
					/>
				</div>
			</li>
		</ul>
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
			Aquí aparecerán {{ refillText }} que le hayas hecho a tu vehículo,
			<br>
			¿Por qué no pruebas a añadir uno?
		</p>
		
		<BaseButton
			:to="`/vehicles/${vehicle?.id}/refill`"
		>
			Añadir repostaje
		</BaseButton>
	</section>
</template>

<style lang="scss" scoped>
section {
	display: flex;
	flex-direction: column;
	gap: 16px;
	
	&.empty-state {
		align-items: center;
		justify-content: center;
		text-align: center;
		
		p {
			font-weight: var(--font-light);
		}
	}
	
	ul {
		display: flex;
		flex-direction: column;
		gap: 16px;
		
		li {
			display: flex;
			align-items: center;
			gap: 16px;
			
			.info {
				display: flex;
				flex-direction: column;
				gap: 4px;
				flex: 1;
			}
			
			.price {
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				gap: 4px;
				margin-left: auto;
				flex-shrink: 0;
			}
		}
	}
}
</style>