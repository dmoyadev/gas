<script setup lang="ts">
import { computed } from 'vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonForm, ButtonMode } from '@/components/button/BaseButton.types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
import { VehicleFuelType } from '@/modules/app/models/Vehicle.ts';

const props = defineProps<{
	modelValue?: VehicleFuelType;
}>();

defineEmits<{
	'update:modelValue': [value?: VehicleFuelType];
	'sendStep': [];
	'stepBack': [];
}>();

const buttonText = computed<string>(() => {
	if (!props.modelValue) {
		return 'Elige una opción';
	}

	const text = {
		diesel: 'Es diésel',
		gasoline: 'Es gasolina',
		electric: 'Es eléctrico',
		hybrid: 'Es híbrido',
	};
	return text[props.modelValue];
});
</script>

<template>
	<main class="step-2">
		<div class="instructions">
			<h1>¡Vale! Y... ¿cómo se mueve?</h1>
			<p>Es importante para darte solo las opciones que necesites. Ni más, ni menos.</p>
		</div>

		<form @submit.prevent="$emit('sendStep')">
			<section class="fuel-type">
				<label class="fuel-type__item">
					<input
						id="car"
						type="radio"
						name="fuel-type"
						:checked="modelValue === VehicleFuelType.GASOLINE"
						:value="VehicleFuelType.GASOLINE"
						@change="$emit('update:modelValue', ($event.target as HTMLInputElement).value as VehicleFuelType)"
					>

					<span class="fuel-type__item__content">
						<BaseIcon
							icon="fa-solid fa-gas-pump"
							:icon-size="IconSize.XL"
						/>
						Gasolina
					</span>
				</label>

				<label class="fuel-type__item">
					<input
						id="car"
						type="radio"
						name="fuel-type"
						:checked="modelValue === VehicleFuelType.DIESEL"
						:value="VehicleFuelType.DIESEL"
						@change="$emit('update:modelValue', ($event.target as HTMLInputElement).value as VehicleFuelType)"
					>

					<span class="fuel-type__item__content">
						<BaseIcon
							icon="fa-solid fa-gas-pump"
							:icon-size="IconSize.XL"
						/>
						Diésel
					</span>
				</label>

				<label class="fuel-type__item">
					<input
						id="car"
						type="radio"
						name="fuel-type"
						:checked="modelValue === VehicleFuelType.ELECTRIC"
						:value="VehicleFuelType.ELECTRIC"
						@change="$emit('update:modelValue', ($event.target as HTMLInputElement).value as VehicleFuelType)"
					>

					<span class="fuel-type__item__content">
						<BaseIcon
							icon="fa-solid fa-charging-station"
							:icon-size="IconSize.XL"
						/>
						Eléctrico
					</span>
				</label>

				<label class="fuel-type__item">
					<input
						id="car"
						type="radio"
						name="fuel-type"
						:checked="modelValue === VehicleFuelType.HYBRID"
						:value="VehicleFuelType.HYBRID"
						@change="$emit('update:modelValue', ($event.target as HTMLInputElement).value as VehicleFuelType)"
					>

					<span class="fuel-type__item__content">
						<span class="fuel-type__item__content__icon">
							<BaseIcon icon="fa-solid fa-gas-pump" />
							<BaseIcon icon="fa-solid fa-charging-station" />
						</span>
						Híbrido
					</span>
				</label>
			</section>

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
					:form="ButtonForm.NOTCHED_LEFT"
					:disabled="!modelValue"
				>
					{{ buttonText }}
				</BaseButton>
			</section>
		</form>
	</main>
</template>

<style scoped lang="scss">
.step-2 {
	gap: 16px;

	form {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 16px;

		.fuel-type {
			width: 100%;
			display: flex;
			flex-direction: column;
			gap: 16px;

			input[type=radio] {
				display: none;
			}

			&__item {
				display: flex;
				align-items: center;
				gap: 16px;
				cursor: pointer;
				border: 1px solid var(--color-secondary-accent);
				border-radius: 4px;
				padding: 12px;
				font-size: 24px;
				max-height: 56px;

				&:has(input:checked) {
					border: none;
					background: var(--color-primary);
					color: var(--color-secondary);
				}

				&__content {
					display: flex;
					align-items: center;
					font-size: 24px;
					gap: 12px;
					height: 32px;

					&__icon {
						display: flex;
						height: 100%;

						:first-child {
							align-self: flex-start;
						}

						:last-child {
							align-self: flex-end;
						}
					}
				}
			}
		}

		.actions {
			margin-top: auto;
			display: flex;
			justify-content: space-between;
		}
	}
}
</style>
