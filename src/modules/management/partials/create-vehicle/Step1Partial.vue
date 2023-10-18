<script setup lang="ts">
import BaseButton from '@/components/button/BaseButton.vue';
import { VehicleType } from '@/modules/app/models/Vehicle.ts';

defineProps<{
	modelValue?: VehicleType
}>();

defineEmits<{
	'update:modelValue': [value?: VehicleType]
	'sendStep': []
}>();
</script>

<template>
	<main class="step-1">
		<h1>Añade tu vehículo</h1>
		<p>Con estos datos personalizaremos cómo usas la aplicación. No te preocupes, podrás editar todos estos datos más adelante.</p>
		
		<h2>¿Qué tipo de vehículo es?</h2>
		<form @submit.prevent="$emit('sendStep')">
			<section class="vehicle-type">
				<label
					class="car"
					:class="{ 'unselected': modelValue && modelValue !== VehicleType.CAR }"
				>
					<input
						id="car"
						type="radio"
						name="vehicle-type"
						:checked="modelValue === VehicleType.CAR"
						:value="VehicleType.CAR"
						@change="$emit('update:modelValue', ($event.target as HTMLInputElement).value as VehicleType)"
					>
					
					<span class="img-wrapper">
						<img
							src="/images/car-silhouette.svg"
							alt="car"
						>
					</span>
				</label>
				
				<label
					class="motorcycle"
					:class="{ 'unselected': modelValue && modelValue !== VehicleType.BIKE }"
				>
					<input
						id="car"
						type="radio"
						name="vehicle-type"
						:checked="modelValue === VehicleType.BIKE"
						:value="VehicleType.BIKE"
						@change="$emit('update:modelValue', ($event.target as HTMLInputElement).value as VehicleType)"
					>
					
					<span class="img-wrapper">
						<img
							src="/images/bike-silhouette.svg"
							alt="motorcycle"
						>
					</span>
				</label>
			</section>
			
			<BaseButton
				v-if="modelValue"
				type="submit"
			>
				Es {{ modelValue === 'car' ? 'un coche' : 'una moto' }}
			</BaseButton>
		</form>
	</main>
</template>

<style scoped lang="scss">
.step-1 {
	overflow-x: hidden;
	
	form {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		
		.vehicle-type {
			margin: 32px 0;
			position: relative;
			width: 100%;
			height: 200px;
			
			input[type=radio] {
				display: none;
				
				&:checked + span {
					opacity: 1;
				}
			}
			
			.img-wrapper {
				width: 350px;
				height: 200px;
				display: flex;
				align-items: flex-end;
				opacity: .4;
			}
			
			.car {
				position: absolute;
				left: calc(-50% - 24px);
				transition: left .2s ease-in-out;
				
				&:has(input:checked) {
					left: calc(-40% - 24px);
				}
				
				&.unselected {
					left: calc(-60% - 24px);
				}
			}
			
			.motorcycle {
				position: absolute;
				right: calc(-50% - 24px);
				transition: right .2s ease-in-out;
				
				&:has(input:checked) {
					right: calc(-40% - 24px);
				}
				
				&.unselected {
					right: calc(-60% - 24px);
				}
			}
		}
	}
}
</style>