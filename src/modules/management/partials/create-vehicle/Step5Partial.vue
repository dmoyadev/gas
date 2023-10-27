<script setup lang="ts">
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/types.ts';
import { useDB } from '@/modules/app/composables/useDB.ts';
import { Vehicle } from '@/modules/app/models/Vehicle.ts';
import { useStorage } from '@/modules/app/composables/useStorage.ts';
import BaseButton from '@/components/button/BaseButton.vue';
import { useRouter } from 'vue-router';

defineEmits<{
	'stepBack': []
}>();

const vehicle = useStorage<Vehicle>('new-vehicle', {} as Vehicle);

const router = useRouter();
const {
	loading,
	error,
	create,
} = useDB('vehicles');

loading.value = true;
if(vehicle.value) {
	create<Vehicle>({
		...vehicle.value,
		selected: true,
	})
		.then(() => {
			setTimeout(() => {
				router.push('/vehicles/__new__/success');
			}, 2000);
		});
}
</script>

<template>
	<main
		v-if="loading && !error"
		class="step-5"
	>
		<div class="icon">
			<BaseIcon
				class="icon-gear"
				icon="fa-solid fa-gear"
				:icon-size="IconSize.XXL"
				spin
			/>
			<BaseIcon
				class="icon-gear"
				icon="fa-solid fa-gear"
				:icon-size="IconSize.XXL"
				spin
				spin-reverse
			/>
		</div>
		<div class="instructions">
			<h1>¡Genial! Vamos a terminar de configurarlo todo</h1>
			<p>Estamos guardando los datos y terminando de configurar la aplicación para que puedas empezar a utilizarla, esto quizá tarde unos segundos…</p>
		</div>
	</main>
	
	<main
		v-else-if="error"
		class="step-5"
	>
		<BaseIcon
			class="icon-xmark"
			icon="fa-regular fa-circle-xmark"
			:icon-size="IconSize.XXL"
		/>
		<div class="instructions">
			<h1>Ha habido algún error...</h1>
			<p>Lo sentimos, vuelve a intentarlo dentro de un rato</p>
		</div>
		
		<BaseButton @click="$emit('stepBack')">
			Volver atrás
		</BaseButton>
	</main>
</template>

<style scoped lang="scss">
.step-5 {
	align-items: center;
	justify-content: center;
	gap: 24px;
	
	.icon {
		display: flex;
		height: 80px;
		
		.icon-gear:last-child {
			margin-left: -8px;
			align-self: flex-end;
		}
	}
	
	.icon-xmark {
		color: var(--color-danger);
	}
}
</style>