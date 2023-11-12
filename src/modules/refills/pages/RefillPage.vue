<script setup lang="ts">
import BaseIcon from '@/components/icon/BaseIcon.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonForm, ButtonMode } from '@/components/button/types.ts';
import { computed, ref, watch } from 'vue';
import { useSelectedVehicle } from '@/modules/vehicles/composables/useSelectedVehicle.ts';
import { VehicleFuelType } from '@/modules/app/models/Vehicle.ts';
import BaseSpinner from '@/components/spinner/BaseSpinner.vue';
import ElectricRefill from '@/modules/refills/partials/ElectricRefill.vue';
import FuelRefill from '@/modules/refills/partials/FuelRefill.vue';
import { Refill } from '@/modules/refills/models/Refill.ts';

const {
	vehicle,
	loading,
} = useSelectedVehicle();

const refillType = ref<'fuel' | 'electric'>('fuel');
watch(vehicle, (value) => {
	if(value?.fuelType === VehicleFuelType.ELECTRIC) {
		refillType.value = 'electric';
	}
});

const fuelText = computed<string>(() => {
	if(!vehicle.value) { return ''; }
	
	switch(vehicle.value?.fuelType) {
		case VehicleFuelType.GASOLINE:
			return 'Repostaje';
		case VehicleFuelType.DIESEL:
			return 'Repostaje';
		case VehicleFuelType.ELECTRIC:
			return 'Recarga';
		case VehicleFuelType.HYBRID:
			return 'Suministro';
		default:
			return '...';
	}
});

const refill = ref<Refill>({} as Refill);
</script>

<template>
	<div class="content">
		<header>
			<BaseButton
				to="/"
				:mode="ButtonMode.CLEAR"
				:form="ButtonForm.INLINE"
			>
				<BaseIcon icon="fa-solid fa-arrow-left" />
			</BaseButton>
			<h1>
				{{ fuelText }}
			</h1>
		</header>
		
		<!-- ⏳ Loading state -->
		<template v-if="loading">
			<BaseSpinner class="icon-loading" />
		</template>
		
		<!-- ✅ Success state -->
		<template v-else>
			<nav v-if="vehicle?.fuelType === VehicleFuelType.HYBRID">
				<button
					:class="{ 'selected': refillType === 'fuel' }"
					@click="refillType = 'fuel'"
				>
					Gasolina
				</button>
				
				<button
					:class="{ 'selected': refillType === 'electric' }"
					@click="refillType = 'electric'"
				>
					Eléctrico
				</button>
			</nav>
			
			<form @submit.prevent>
				<!-- 🔋 Electric refill -->
				<ElectricRefill
					v-if="refillType === 'electric'"
					:refill="refill"
				/>
			
				<!-- ⛽️ Fuel refill -->
				<FuelRefill
					v-if="refillType === 'fuel'"
					:refill="refill"
				/>
				
				<BaseButton type="submit">
					Guardar
				</BaseButton>
			</form>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.content {
	min-height: 100svh;
	display: flex;
	flex-direction: column;
}

header {
	display: flex;
	align-items: center;
	padding: 16px 16px 8px;
	
	h1 {
		font-size: var(--font-size-title);
		font-weight: var(--font-heavy);
	}
}

.icon-loading {
	margin: auto;
}

nav {
	display: flex;
	align-items: center;
	border-bottom: 1px solid var(--color-secondary-accent);
	
	button {
		flex: 1;
		text-transform: uppercase;
		padding: 8px;
		text-align: center;
		font-size: var(--font-size-small);
		
		&:not(:last-child) {
			border-right: 1px solid var(--color-secondary-accent);
		}
		
		&.selected {
			color: var(--color-primary);
		}
	}
}

form {
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 32px;
}
</style>