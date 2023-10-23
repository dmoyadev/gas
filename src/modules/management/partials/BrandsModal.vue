<script setup lang="ts">
import { VehicleBrand, VehicleType } from '@/modules/app/models/Vehicle.ts';
import { computed, ref } from 'vue';
import { carManufacturers } from '@/utils/consts/car-manufacturers.ts';
import { motorcycleManufacturers } from '@/utils/consts/motorcycle-manufacturers.ts';
import BaseInput from '@/components/input/BaseInput.vue';
import { InputType } from '@/components/input/types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';

const props = defineProps<{
	vehicleType: VehicleType
}>();

defineEmits<{
	'select-brand': [value?: VehicleBrand]
}>();

const searchQuery = ref('');
const brands = computed(() => {
	const brands = props.vehicleType === VehicleType.CAR
		? carManufacturers
		: motorcycleManufacturers;
	
	return brands.filter((brand) => {
		return brand.name.toLowerCase().includes(searchQuery.value.toLowerCase());
	});
});
</script>

<template>
	<main>
		<BaseInput
			v-model="searchQuery"
			:input-type="InputType.SEARCH"
		>
			Buscar por nombre
		</BaseInput>
		
		<ul>
			<li
				v-for="(brand, index) in brands"
				:key="index"
				@click="$emit('select-brand', brand)"
			>
				<div class="img-wrapper">
					<img
						:src="brand.logo"
						:alt="brand.name"
					>
				</div>
				<span>{{ brand.name }}</span>
				<BaseIcon icon="fa-solid fa-chevron-right" />
			</li>
		</ul>
	</main>
</template>

<style scoped lang="scss">
main {
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	color: var(--color-secondary-accent);
	
	ul {
		display: flex;
		flex-direction: column;
		
		li {
			display: flex;
			align-items: center;
			padding: 8px 0;
			gap: 12px;
			
			.img-wrapper {
				width: 24px;
				height: 24px;
				
				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
			}
			
			span {
				margin-right: auto;
			}
		}
	}
}
</style>