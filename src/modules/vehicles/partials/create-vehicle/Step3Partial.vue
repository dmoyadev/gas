<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonForm, ButtonMode } from '@/components/button/types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import type { VehicleBrand } from '@/modules/app/models/Vehicle.ts';
import { VehicleType } from '@/modules/app/models/Vehicle.ts';
import { carManufacturers } from '@/utils/consts/car-manufacturers.ts';
import { motorcycleManufacturers } from '@/utils/consts/motorcycle-manufacturers.ts';
import { IconSize } from '@/components/icon/types.ts';
import BaseInput from '@/components/input/BaseInput.vue';
import { InputType } from '@/components/input/types.ts';
import BaseModal from '@/components/modal/BaseModal.vue';
import BrandsModal from '@/modules/vehicles/partials/BrandsModal.vue';

const props = defineProps<{
	vehicleType: VehicleType;
	brand?: VehicleBrand;
	model?: string;
	year?: number;
}>();

const emit = defineEmits<{
	'update:brand': [value?: VehicleBrand];
	'update:model': [value?: string];
	'update:year': [value?: number];
	'sendStep': [];
	'stepBack': [];
}>();

const modelProp = computed<string | undefined>({
	get: () => props.model,
	set: value => emit('update:model', value),
});

const yearProp = computed<number | undefined>({
	get: () => isNaN(+(props.year || 0)) ? undefined : +props.year!,
	set: value => emit('update:year', value ? +value : undefined),
});

const hasFilledSomething = computed<boolean>(() => {
	return !!props.brand
		|| !!props.model
		|| !!props.year;
});

const highlightedBrands = computed<VehicleBrand[]>(() => {
	const brands = props.vehicleType === VehicleType.CAR
		? carManufacturers
		: motorcycleManufacturers;

	const highlightedBrands = brands.filter(brand => brand.highlighted);
	if (props.brand && !highlightedBrands.find(brand => brand.name === props.brand?.name)) {
		highlightedBrands.pop();
		highlightedBrands.push(props.brand);
	}

	return highlightedBrands;
});

const showBrandModal = ref(false);
watch(() => props.brand, (value, oldValue) => {
	if (value !== oldValue) {
		showBrandModal.value = false;
	}
});
</script>

<template>
	<main class="step-3">
		<div class="instructions">
			<h1>Si quieres, cuéntanos más</h1>
			<p>Nos ayudará a mostrarte pantallas más bonitas y con un toque de personalización.</p>
		</div>

		<form @submit.prevent="$emit('sendStep')">
			<section class="brand">
				<label
					v-for="(manufacturer, index) in highlightedBrands"
					:key="index"
					:class="{ active: manufacturer.name === brand?.name }"
					@click="$emit('update:brand', manufacturer)"
				>
					<span class="img-wrapper">
						<img
							:src="manufacturer.logo"
							:alt="manufacturer.name"
						>
					</span>
				</label>
				<label @click="showBrandModal = true">
					<span class="img-wrapper">
						<BaseIcon
							icon="fa-solid fa-ellipsis"
							:icon-size="IconSize.XL"
						/>
					</span>
				</label>

				<BaseModal
					:show="showBrandModal"
					title="Marcas"
					@close="showBrandModal = false"
				>
					<BrandsModal
						:vehicle-type="props.vehicleType"
						@select-brand="$emit('update:brand', $event); showBrandModal = false;"
					/>
				</BaseModal>

				<span
					v-if="!!brand"
					class="selection"
				>
					Has seleccionado {{ brand.name }}
				</span>
			</section>

			<BaseInput v-model="modelProp">
				Modelo
			</BaseInput>

			<BaseInput
				v-model.number="yearProp"
				:input-type="InputType.NUMBER"
				min="1900"
				:max="new Date().getFullYear()"
				step="1"
			>
				Año de matriculación
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
					:form="ButtonForm.NOTCHED_LEFT"
				>
					{{ !hasFilledSomething ? 'Rellenar más tarde' : 'Continuar' }}
				</BaseButton>
			</section>
		</form>
	</main>
</template>

<style scoped lang="scss">
.step-3 {
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
