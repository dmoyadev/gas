<script setup lang="ts">
import { computed } from 'vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonForm, ButtonMode } from '@/components/button/types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { VehicleFuelType } from '@/modules/app/models/Vehicle.ts';
import BaseInput from '@/components/input/BaseInput.vue';
import { InputType } from '@/components/input/types.ts';

const props = defineProps<{
	fuelType: VehicleFuelType;
	plate?: string;
	odometer?: number;
	batteryCapacity?: number;
	alias?: string;
}>();

const emit = defineEmits<{
	'update:plate': [value?: string];
	'update:odometer': [value?: number];
	'update:batteryCapacity': [value?: number];
	'update:alias': [value?: string];
	'sendStep': [];
	'stepBack': [];
}>();

const plateProp = computed<string | undefined>({
	get: () => props.plate,
	set: value => emit('update:plate', value?.replace(/\s+/g, ' ')),
});

const odometerProp = computed<number | undefined>({
	get: () => isNaN(+(props.odometer || 0)) ? undefined : +props.odometer!,
	set: value => emit('update:odometer', value ? +value : undefined),
});

const batteryCapacityProp = computed<number | undefined>({
	get: () => isNaN(+(props.batteryCapacity || 0)) ? undefined : +props.batteryCapacity!,
	set: value => emit('update:batteryCapacity', value ? +value : undefined),
});

const aliasProp = computed<string | undefined>({
	get: () => props.alias,
	set: value => emit('update:alias', value),
});

const hasBattery = computed<boolean>(() => {
	return [VehicleFuelType.ELECTRIC, VehicleFuelType.HYBRID].includes(props.fuelType);
});

const canProceed = computed<boolean>(() => {
	return !!plateProp.value
		&& !!odometerProp.value
		&& (!hasBattery.value || !!batteryCapacityProp.value);
});
</script>

<template>
	<main class="step-4">
		<div class="instructions">
			<h1>Y ya para terminar...</h1>
			<p>Estos datos son necesarios para hacer cálculos en los suministros y demás secciones.</p>
		</div>

		<form @submit.prevent="$emit('sendStep')">
			<BaseInput v-model.trim="plateProp">
				Matrícula
			</BaseInput>

			<BaseInput
				v-model="odometerProp"
				:input-type="InputType.NUMBER"
				min="0"
			>
				Kilometraje
			</BaseInput>

			<BaseInput
				v-if="hasBattery"
				v-model.number="batteryCapacityProp"
				:input-type="InputType.NUMBER"
				min="0"
				step="any"
			>
				Capacidad de la batería
			</BaseInput>

			<BaseInput v-model="aliasProp">
				Nombre del vehículo

				<template #helper>
					Para que puedas identificarlo rápidamente entre el resto de vehículos. Es totalmente opcional.
				</template>
			</BaseInput>

			<section class="actions">
				<BaseButton
					type="button"
					:form="ButtonForm.CIRCLE"
					:mode="ButtonMode.OUTLINE"
					@click="$emit('stepBack')"
				>
					<BaseIcon icon="fa-solid fa-arrow-left" />
				</BaseButton>
				<BaseButton
					type="submit"
					:disabled="!canProceed"
					:form="ButtonForm.NOTCHED_LEFT"
				>
					Terminar
				</BaseButton>
			</section>
		</form>
	</main>
</template>

<style scoped lang="scss">
.step-4 {
	form {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 24px;
		margin-top: 16px;

		.brand {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 8px;
			flex-wrap: wrap;

			label {
				border: 1px solid var(--color-secondary-accent);
				width: calc(20% - 8px);
				aspect-ratio : 1 / 1;
				border-radius: 4px;
				display: flex;
				align-items: center;
				justify-content: center;

				&:last-child {
					border: none;
				}

				&.active {
					background: var(--color-primary);

					img {
						filter: invert(1);
					}
				}

				.img-wrapper {
					width: 32px;
					height: 32px;
					display: flex;
					align-items: center;
					justify-content: center;

					img {
						max-width: 100%;
						max-height: 100%;
					}
				}
			}
		}

		.selection {
			font-size: var(--font-size-small);
			color: var(--color-primary);
		}

		.actions {
			margin-top: auto;
			display: flex;
			justify-content: space-between;
		}
	}
}
</style>
