<script setup lang="ts">
import { ref } from 'vue';
import type { RefillStation } from '../models/RefillStation';
import BaseModal from '@/components/modal/BaseModal.vue';
import { useStorage } from '@/modules/app/composables/useStorage.ts';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonMode } from '@/components/button/BaseButton.types.ts';
import BaseInput from '@/components/input/BaseInput.vue';

const emit = defineEmits<{ createStation: [newStation?: RefillStation] }>();

const show = defineModel<boolean>('show');

const newStation = useStorage<RefillStation>('new-station', {} as RefillStation);

const loadingCreation = ref(false);
const error = ref(false);
async function save() {
	error.value = false;
	if (!newStation.value?.name) {
		error.value = true;
		return;
	}
	loadingCreation.value = true;

	const userPosition: GeolocationPosition | undefined = await new Promise((resolve) => {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					resolve(position);
				},
				() => {
					resolve(undefined);
				},
			);
		}
	});

	newStation.value = {
		zip: '',
		address: '',
		lat: userPosition?.coords.latitude || -1,
		long: userPosition?.coords.longitude || -1,
		city: '',
		state: '',
		name: newStation.value?.name,
	};

	const station = newStation.value;
	newStation.value = undefined;
	emit('createStation', station);
	loadingCreation.value = false;
}
</script>

<template>
	<BaseModal
		v-if="show"
		title="Añadir gasolinera"
		@close="show = false"
	>
		<template #header-action>
			<BaseButton
				:mode="ButtonMode.CLEAR"
				form="form"
				:disabled="loadingCreation"
				@click="save()"
			>
				Guardar
			</BaseButton>
		</template>

		<form
			v-if="newStation"
			id="form"
			@submit.prevent
		>
			<BaseInput
				v-model="newStation.name"
				:has-error="error && !newStation.name"
				:disabled="loadingCreation"
				autofocus
				required
			>
				Nombre de la gasolinera

				<template #error>
					El nombre es obligatorio
				</template>
			</BaseInput>
		</form>
	</BaseModal>
</template>

<style scoped lang="scss">
form {
	padding: 8px 16px 16px;
}
</style>
