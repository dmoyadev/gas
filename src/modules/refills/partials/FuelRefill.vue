<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import BaseBigNumberInput from '@/components/big-number-input/BaseBigNumberInput.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import { InputType } from '@/components/input/BaseInput.types.ts';
import type { Fuel, Refill } from '@/modules/refills/models/Refill.ts';
import { useSelectedVehicle } from '@/modules/vehicles/composables/useSelectedVehicle.ts';
import { VehicleFuelType } from '@/modules/app/models/Vehicle.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
import { useRecentRefills } from '@/modules/refills/composables/useRecentRefills.ts';
import StationsSelect from '@/modules/refills/partials/StationsSelect.vue';
import { stringToNumber } from '@/utils/helpers.ts';

const refill = defineModel<Refill>('refill', { required: true });

const { vehicle } = useSelectedVehicle();

const { refills } = useRecentRefills();
const canCheckOdometer = ref(false);
const hasOdometerError = computed<boolean>(() => {
	if (!canCheckOdometer.value) {
		return false;
	}

	if (refill.value.odometer === undefined || refills.value[0]?.odometer === undefined) {
		return false;
	}

	return refill.value.odometer < refills.value[0].odometer;
});

const fuelTypes = ref<Fuel[]>([]);
watch(vehicle, (value) => {
	if (!value) {
		return;
	}

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

	if (fuelTypes.value.length > 0) {
		refill.value.fuelType = fuelTypes.value[0];
	}
}, { immediate: true });

const hasErrorUnitCost = ref(false);
function updateUnits(unitCost?: string) {
	hasErrorUnitCost.value = false;
	const parsedUnitCost = stringToNumber(unitCost);
	if (isNaN(parsedUnitCost)) {
		hasErrorUnitCost.value = true;
		return;
	}

	if (refill.value.totalCost && unitCost) {
		const parsedTotalCost = stringToNumber(refill.value.totalCost);
		const units = +(parsedTotalCost / parsedUnitCost).toFixed(2);
		if (units !== Number.POSITIVE_INFINITY && !isNaN(units)) {
			refill.value.units = units;
		}
	}
}

const hasErrorUnits = ref(false);
function updateUnitCost(units?: string) {
	hasErrorUnits.value = false;
	const parsedUnits = stringToNumber(units);
	if (isNaN(parsedUnits)) {
		hasErrorUnits.value = true;
		return;
	}

	if (refill.value.totalCost && units) {
		const parsedTotalCost = stringToNumber(refill.value.totalCost);
		const unitCost = +(parsedTotalCost / parsedUnits).toFixed(3);
		if (unitCost !== Number.POSITIVE_INFINITY && !isNaN(unitCost)) {
			refill.value.unitCost = unitCost;
		}
	}
}

const hasErrorTotalCost = ref(false);
function updateUnitsAndUnitCost(totalCost?: string) {
	hasErrorTotalCost.value = false;
	const parsedTotalCost: number = stringToNumber(totalCost);
	if (isNaN(parsedTotalCost)) {
		hasErrorTotalCost.value = true;
		return;
	}

	if (totalCost && refill.value.units) {
		const parsedUnits = stringToNumber(refill.value.units);
		const unitCost = +(parsedTotalCost / parsedUnits).toFixed(3);
		if (unitCost !== Number.POSITIVE_INFINITY && !isNaN(unitCost)) {
			refill.value.unitCost = unitCost;
		}
		refill.value.unitCost = +(parsedTotalCost / refill.value.units).toFixed(3);
	} else if (totalCost && refill.value.unitCost) {
		const parsedUnitCost = stringToNumber(refill.value.unitCost);
		const units = +(parsedTotalCost / parsedUnitCost).toFixed(2);
		if (units !== Number.POSITIVE_INFINITY && !isNaN(units)) {
			refill.value.units = units;
		}
	}
}
</script>

<template>
	<main>
		<section
			v-if="fuelTypes.length"
			class="fuel-types"
		>
			<label
				v-for="(fuelType, index) in fuelTypes"
				:key="index"
				class="fuel-type"
			>
				<input
					v-model="refill.fuelType"
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

		<p
			v-if="hasErrorUnitCost || hasErrorUnits || hasErrorTotalCost"
			class="error"
		>
			Solo puedes introducir números válidos.
		</p>

		<BaseBigNumberInput
			v-model="refill.totalCost"
			placeholder="·,···"
			required
			:has-error="hasErrorTotalCost"
			@update:model-value="updateUnitsAndUnitCost($event)"
		>
			Coste total

			<template #append>
				€
			</template>
		</BaseBigNumberInput>

		<section class="refill-cost">
			<BaseBigNumberInput
				v-model="refill.unitCost"
				placeholder="·,···"
				required
				:has-error="hasErrorUnitCost"
				@update:model-value="updateUnits($event)"
			>
				Precio del litro

				<template #append>
					€/L
				</template>
			</BaseBigNumberInput>

			<BaseBigNumberInput
				v-model="refill.units"
				placeholder="·,···"
				required
				:has-error="hasErrorUnits"
				@update:model-value="updateUnitCost($event)"
			>
				Litros repostados

				<template #append>
					L
				</template>
			</BaseBigNumberInput>
		</section>

		<BaseInput
			v-model.number="refill.odometer"
			:input-type="InputType.NUMBER"
			:has-error="hasOdometerError"
			:custom-validity="`El kilometraje actual no puede ser inferior al anterior (${vehicle?.odometer})`"
			required
			@blur="canCheckOdometer = true"
		>
			Kilometraje actual

			<template #append>
				<span>Km</span>
			</template>

			<template #error>
				{{ `El kilometraje actual no puede ser inferior al anterior (${vehicle?.odometer}km)` }}
			</template>

			<template
				v-if="!hasOdometerError && vehicle?.odometer"
				#helper
			>
				{{ `El último kilometraje registrado es de ${vehicle.odometer}km` }}
			</template>
		</BaseInput>

		<StationsSelect v-model="refill.station" />

		<BaseInput
			v-model="refill.notes"
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

	.error {
		font-size: var(--font-size-small);
		font-style: italic;
		color: var(--color-danger);
		text-align: center;
	}
}
</style>
