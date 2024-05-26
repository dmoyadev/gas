<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import BaseBigNumberInput from '@/components/big-number-input/BaseBigNumberInput.vue';
import type { Refill } from '@/modules/refills/models/Refill.ts';
import { InputType } from '@/components/input/BaseInput.types.ts';
import BaseInput from '@/components/input/BaseInput.vue';
import { useSelectedVehicle } from '@/modules/vehicles/composables/useSelectedVehicle.ts';
import { useRecentRefills } from '@/modules/refills/composables/useRecentRefills.ts';
import { stringToNumber } from '@/utils/helpers.ts';

const refill = defineModel<Refill>('refill', { required: true });

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

const hasBatteryError = computed<boolean>(() => {
	const parsedInitial = stringToNumber(refill.value.chargeInitial);
	const parsedFinal = stringToNumber(refill.value.chargeFinal);
	if ((isNaN(parsedInitial) || parsedInitial === 0)
		|| (isNaN(parsedFinal) || parsedFinal === 0)) {
		return false;
	}

	return parsedFinal <= parsedInitial;
});

const { vehicle } = useSelectedVehicle();
const filledCapacity = computed<string>(() => {
	const parsedInitial = stringToNumber(refill.value.chargeInitial);
	const parsedFinal = stringToNumber(refill.value.chargeFinal);
	if ((isNaN(parsedInitial) || parsedInitial === 0)
		|| (isNaN(parsedFinal) || parsedFinal === 0)) {
		return (0).toFixed(2);
	}

	if (!vehicle.value) {
		return (0).toFixed(2);
	}

	if (hasBatteryError.value) {
		return (0).toFixed(2);
	}

	const filledBattery = parsedFinal - parsedInitial;
	return (filledBattery * vehicle.value?.batteryCapacity / 100).toFixed(2);
});
watch(filledCapacity, (value) => {
	refill.value.units = +value;
});

const totalCost = computed<string>(() => {
	const parsedUnitCost = stringToNumber(refill.value.unitCost);
	if (isNaN(parsedUnitCost) || parsedUnitCost === 0) {
		return '';
	}

	return (+filledCapacity.value * parsedUnitCost).toFixed(2);
});
watch(totalCost, (value) => {
	refill.value.totalCost = +value;
});

const hasErrorNumber = ref(false);
function checkNumberError(value?: string) {
	hasErrorNumber.value = false;
	const parsedUnitCost = stringToNumber(value);
	if (isNaN(parsedUnitCost)) {
		hasErrorNumber.value = true;
	}
}
</script>

<template>
	<main>
		<p
			v-if="hasErrorNumber"
			class="error"
		>
			Solo puedes introducir números válidos.
		</p>

		<section class="costs">
			<BaseBigNumberInput
				v-model="refill.unitCost"
				placeholder="·,···"
				required
				:has-error="hasErrorNumber"
				@update:model-value="checkNumberError($event)"
			>
				Precio del Kw

				<template #append>
					€/Kw
				</template>
			</BaseBigNumberInput>

			<div class="total-cost">
				<span class="label">Coste estimado</span>
				<span class="cost">
					{{ totalCost }}
					<span class="unit">€</span>
				</span>
			</div>
		</section>

		<section class="battery">
			<BaseBigNumberInput
				v-model="refill.chargeInitial"
				placeholder="··"
				step="1"
				required
				:has-error="hasBatteryError"
				@update:model-value="checkNumberError($event)"
			>
				<BaseIcon
					class="icon-battery"
					icon="fa-solid fa-battery-2"
					:icon-size="IconSize.M"
				/>
				Inicial

				<template #append>
					%
				</template>
			</BaseBigNumberInput>

			<div class="capacity">
				<BaseIcon
					class="icon-battery"
					icon="fa-solid fa-plug-circle-bolt"
					:icon-size="IconSize.L"
				/>
				<div class="capacity-info">
					<span class="filled-capacity">{{ filledCapacity }}Kw /</span>
					<span class="battery-capacity">{{ vehicle?.batteryCapacity.toFixed(2) || '' }}Kw</span>
				</div>
			</div>

			<BaseBigNumberInput
				v-model="refill.chargeFinal"
				placeholder="···"
				step="1"
				max="100"
				required
				:has-error="hasBatteryError"
				@update:model-value="checkNumberError($event)"
			>
				<BaseIcon
					class="icon-battery"
					icon="fa-solid fa-battery-full"
					:icon-size="IconSize.M"
				/>
				Final

				<template #append>
					%
				</template>
			</BaseBigNumberInput>
		</section>

		<p
			v-if="hasBatteryError"
			class="error"
		>
			La batería final tiene que ser superior a la inicial
		</p>

		<BaseInput
			v-model="refill.odometer"
			:input-type="InputType.NUMBER"
			:has-error="hasOdometerError"
			custom-validity="El kilometraje actual no puede ser inferior al anterior"
			required
			@blur="canCheckOdometer = true"
		>
			Kilometraje actual

			<template #append>
				Km
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

	.icon-battery {
		color: var(--color-success);
	}

	.costs {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;

		.total-cost {
			min-width: calc(50% - 12px);
			display: flex;
			flex-direction: column;
			align-items: flex-end;

			.label {
				font-size: var(--font-size-small);
				font-weight: var(--font-weight-light);
				font-style: italic;
			}

			.cost {
				min-height: 32px;
				font-size: 32px;
				font-weight: var(--font-weight-heavy);
				color: var(--color-success);
				font-family: var(--font-family-monospace);
				display: flex;
				align-items: flex-end;
				justify-content: flex-end;
				gap: 4px;

				.unit {
					font-size: var(--font-size-body);
					margin-bottom: 3px;
				}
			}
		}
	}

	.battery {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;

		.capacity {
			display: flex;
			align-items: center;
			gap: 8px;
			text-align: right;

			.capacity-info {
				min-width: 8ch;
				display: flex;
				flex-direction: column;

				.filled-capacity {
					font-weight: var(--font-weight-heavy);
					font-family: var(--font-family-monospace);
				}

				.battery-capacity {
					font-size: var(--font-size-small);
					font-weight: var(--font-weight-light);
					font-family: var(--font-family-monospace);
				}
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
