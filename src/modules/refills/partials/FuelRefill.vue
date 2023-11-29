<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import BaseBigNumberInput from '@/components/big-number-input/BaseBigNumberInput.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import { InputType } from '@/components/input/types.ts';
import { Fuel, Refill } from '@/modules/refills/models/Refill.ts';
import { useSelectedVehicle } from '@/modules/vehicles/composables/useSelectedVehicle.ts';
import { VehicleFuelType } from '@/modules/app/models/Vehicle.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/types.ts';

const props = defineProps<{
	refill: Refill
}>();

const emit = defineEmits<{
	'update:refill': [value: Refill]
}>();

const data = computed<Refill>({
	get: () => props.refill,
	set: (value: Refill) => emit('update:refill', value),
});

const { vehicle } = useSelectedVehicle();

const fuelTypes = ref<Fuel[]>([]);
watch(vehicle, (value) => {
	if(!value) { return; }
	
	switch (value.fuelType) {
		case VehicleFuelType.GASOLINE:
			fuelTypes.value = [
				{
					name: 'Gasolina E95',
					type: 'fuel',
				},
				{
					name: 'Gasolina E98',
					type: 'fuel',
				},
			];
			break;
		case VehicleFuelType.DIESEL:
			fuelTypes.value = [
				{
					name: 'Diésel',
					type: 'fuel',
				},
				{
					name: 'Biodiésel',
					type: 'fuel',
				},
			];
			break;
		case VehicleFuelType.HYBRID:
			fuelTypes.value = [
				{
					name: 'Gasolina E95',
					type: 'fuel',
				},
				{
					name: 'Gasolina E98',
					type: 'fuel',
				},
			];
			break;
		default:
			fuelTypes.value = [];
			break;
	}
	
	if(fuelTypes.value.length > 0) {
		data.value.fuelType = fuelTypes.value[0];
	}
}, { immediate: true });

function updateUnits(unitCost?: number) {
	if(data.value.totalCost && unitCost) {
		data.value.units = +(data.value.totalCost / unitCost).toFixed(2);
	}
}

function updateUnitCost(units?: number) {
	if(data.value.totalCost && units) {
		data.value.unitCost = +(data.value.totalCost / units).toFixed(3);
	}
}

function updateUnitsAndUnitCost(totalCost?: number) {
	if(totalCost && data.value.units) {
		data.value.unitCost = +(totalCost / data.value.units).toFixed(3);
	} else if(totalCost && data.value.unitCost) {
		data.value.units = +(totalCost / data.value.unitCost).toFixed(2);
	}
}
</script>

<template>
	<main>
		<section class="fuel-types">
			<label
				v-for="(fuelType, index) in fuelTypes"
				:key="index"
				class="fuel-type"
			>
				<input
					v-model="data.fuelType"
					type="radio"
					:value="fuelType"
				>
				<BaseIcon
					:icon="`fa-solid ${fuelType.type === 'fuel' ? 'fa-gas-pump' : 'fa-charging-station'}`"
					:icon-size="IconSize.M"
				/>
				{{ fuelType.name }}
			</label>
		</section>
		
		<BaseBigNumberInput
			v-model.number="data.totalCost"
			placeholder="·,···"
			is-required
			@update:model-value="updateUnitsAndUnitCost($event)"
		>
			Coste total
			
			<template #append>
				€
			</template>
		</BaseBigNumberInput>
		
		<section class="refill-cost">
			<BaseBigNumberInput
				v-model.number="data.unitCost"
				placeholder="·,···"
				is-required
				@update:model-value="updateUnits($event)"
			>
				Precio del litro
				
				<template #append>
					€/L
				</template>
			</BaseBigNumberInput>
			
			<BaseBigNumberInput
				v-model.number="data.units"
				placeholder="·,···"
				is-required
				@update:model-value="updateUnitCost($event)"
			>
				Litros repostados
				
				<template #append>
					L
				</template>
			</BaseBigNumberInput>
		</section>
		
		<BaseInput
			v-model.number="data.odometer"
			:input-type="InputType.NUMBER"
			is-required
		>
			Kilometraje actual
			
			<template #append>
				Km
			</template>
		</BaseInput>
		
		<BaseInput
			v-model="data.notes"
			:input-type="InputType.TEXTAREA"
		>
			Anotaciones
		</BaseInput>
	</main>
</template>

<style lang="scss" scoped>
main {
	display: flex;
	flex-direction: column;
	gap: 24px;
	
	.refill-cost {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 16px;
	}
	
	.fuel-types {
		display: flex;
		align-items: center;
		gap: 8px;
		overflow-x: auto;
		padding: 0 16px 8px;
		margin: 0 -16px -8px;
		
		.fuel-type {
			display: flex;
			align-items: center;
			gap: 4px;
			padding: 8px 12px;
			border-radius: 4px;
			border: 1px solid var(--color-secondary-accent);
			cursor: pointer;
			white-space: nowrap;
			
			&:has(input:checked) {
				border: none;
				padding: 9px 13px;
				background-color: var(--color-primary);
				color: var(--color-secondary);
			}
			
			input {
				display: none;
			}
		}
	}
}
</style>