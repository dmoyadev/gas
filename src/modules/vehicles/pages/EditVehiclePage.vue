<script setup lang="ts">
import { ref } from 'vue';
import type { RefillStation } from '@/modules/refills/models/RefillStation.ts';
import { eess } from '@/utils/consts/eess.ts';
import { haversineDistance } from '@/utils/helpers.ts';

function getStationsWithinRadius(centerLat: number, centerLong: number, radiusKm: number): RefillStation[] {
	return eess
		.filter((place) => {
			const distance = haversineDistance(centerLat, centerLong, place.lat, place.long);
			place.distance = distance;
			return distance <= radiusKm;
		})
		.sort((a, b) => a.distance! - b.distance!);
}

const stations = ref<RefillStation[]>([]);
if ('geolocation' in navigator) {
	navigator.geolocation.getCurrentPosition((position) => {
		stations.value = getStationsWithinRadius(position.coords.latitude, position.coords.longitude, 2);
	});
}
</script>

<template>
	Edit vehicle!

	<ul>
		<li v-for="station in stations">
			name: {{ station.name }} - distance: {{ station.distance }} km
			<br>
		</li>
	</ul>
</template>

<style lang="scss" scoped>

</style>
