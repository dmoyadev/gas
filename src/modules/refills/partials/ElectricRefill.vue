<script setup lang="ts">
import { computed, watch } from 'vue';
import { IconSize } from '@/components/icon/types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import BaseBigNumberInput from '@/components/big-number-input/BaseBigNumberInput.vue';
import { Refill } from '@/modules/refills/models/Refill.ts';
import { InputType } from '@/components/input/types.ts';
import BaseInput from '@/components/input/BaseInput.vue';
import { useSelectedVehicle } from '@/modules/vehicles/composables/useSelectedVehicle.ts';

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

const hasBatteryError = computed<boolean>(() => {
	return data.value.chargeFinal <= data.value.chargeInitial;
});

const { vehicle } = useSelectedVehicle();
const filledCapacity = computed<string>(() => {
	if(!vehicle.value || !data.value.chargeFinal) { return (0).toFixed(2); }
	if(data.value.chargeInitial > data.value.chargeFinal) { return (0).toFixed(2); }
	
	const filledBattery = data.value.chargeFinal - (data.value.chargeInitial ?? 0);
	return (filledBattery * vehicle.value?.batteryCapacity / 100).toFixed(2);
});

const totalCost = computed<string>(() => {
	if(!data.value.unitCost) { return ''; }
	return (+filledCapacity.value * (data.value.unitCost ?? 0)).toFixed(2);
});
watch(totalCost, (value) => {
	data.value.totalCost = +value;
});
</script>

<template>
	<main>
		<section class="costs">
			<BaseBigNumberInput
				v-model.number="data.unitCost"
				placeholder="·,···"
				is-required
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
				v-model.number="data.chargeInitial"
				placeholder="··"
				step="1"
				is-required
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
					<span class="battery-capacity">{{ vehicle?.batteryCapacity.toFixed(2) }}Kw</span>
				</div>
			</div>
			
			<BaseBigNumberInput
				v-model.number="data.chargeFinal"
				placeholder="···"
				step="1"
				max="100"
				is-required
				:has-error="hasBatteryError"
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
		
		<span
			v-if="hasBatteryError"
			class="error"
		>
			La batería final tiene que ser superior a la inicial
		</span>
		
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
				font-weight: var(--font-light);
				font-style: italic;
			}
			
			.cost {
				min-height: 32px;
				font-size: 32px;
				font-weight: var(--font-heavy);
				color: var(--color-success);
				font-family: 'Anonymous Pro', serif;
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
					font-weight: var(--font-heavy);
					font-family: 'Anonymous Pro', serif;
				}
				
				.battery-capacity {
					font-size: var(--font-size-small);
					font-weight: var(--font-light);
					font-family: 'Anonymous Pro', serif;
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