<script setup lang="ts">
import { ref } from 'vue';
import type { RefillStation } from '@/modules/refills/models/RefillStation.ts';
import { eess } from '@/utils/consts/eess.ts';
import { capitalizeAll, getLogoForStation, haversineDistance } from '@/utils/helpers.ts';
import BaseSelect from '@/components/select/BaseSelect.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import StationsSelectModal from '@/modules/refills/partials/StationsSelectModal.vue';

const modelValue = defineModel<RefillStation>();

const loadingStations = ref(false);
const stations = ref<RefillStation[]>([]);
const hasGeolocation = ref(false);
function getNearbyStations() {
	loadingStations.value = true;

	if (hasGeolocation.value && stations.value.length) {
		loadingStations.value = false;
		return;
	}

	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition((position) => {
			hasGeolocation.value = true;
			stations.value = eess
				.map((place) => {
					place.distance = haversineDistance(
						position.coords.latitude,
						position.coords.longitude,
						place.lat,
						place.long,
					);
					return place;
				})
				.sort((a, b) => a.distance! - b.distance!);
			loadingStations.value = false;
		}, () => {
			hasGeolocation.value = false;
			stations.value = eess;
			loadingStations.value = false;
		});
	}
}
</script>

<template>
	<BaseSelect
		v-model="modelValue"
		:items="stations"
		modal-title="Gasolinera"
		@open-modal="getNearbyStations()"
	>
		Gasolinera

		<template
			v-if="modelValue"
			#content
		>
			<div class="select-content">
				<div
					v-if="getLogoForStation(modelValue.name)"
					class="img-wrapper"
				>
					<img
						:src="getLogoForStation(modelValue.name)"
						:alt="modelValue.name"
						class="logo"
					>
				</div>

				<BaseIcon
					v-else
					icon="fa-solid fa-gas-pump"
					class="img-wrapper"
				/>

				<span>
					{{ capitalizeAll(modelValue.name) }}
					<template v-if="modelValue.city">
						-
						{{ capitalizeAll(modelValue.city) }}
					</template>
					<template v-if="modelValue.address">
						-
						{{ capitalizeAll(modelValue.address) }}
					</template>
				</span>
			</div>
		</template>

		<template #modal="{ close }">
			<StationsSelectModal
				:stations
				:selected-station="modelValue"
				:loading-stations="loadingStations"
				:has-geolocation="hasGeolocation"
				:close
			/>
		</template>
	</BaseSelect>
</template>

<style scoped lang="scss">
.select-content {
	display: flex;
	gap: 8px;

	.img-wrapper {
		flex-shrink: 0;
		width: 16px;
		height: 16px;

		img {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
	}

	span {
		// Show only one line
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}
</style>
