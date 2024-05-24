<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { InputType } from '@/components/input/BaseInput.types.ts';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
import { ButtonMode } from '@/components/button/BaseButton.types.ts';
import { capitalizeAll, getLogoForStation, normalize } from '@/utils/helpers.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import type { RefillStation } from '@/modules/refills/models/RefillStation.ts';
import StationsSelectModalCustomStationModal from '@/modules/refills/partials/StationsSelectModalCustomStationModal.vue';

interface Props {
	close: (item: RefillStation) => void;
	stations: RefillStation[];
	loadingStations: boolean;
	hasGeolocation: boolean;
	selectedStation?: RefillStation;
}
const props = defineProps<Props>();

const showCustomEESSModal = ref(false);

const stationsPage = ref(0);
const searchQuery = ref('');
watch(searchQuery, () => stationsPage.value = 0);

const filteredStations = ref<RefillStation[]>([]);
watchEffect(() => {
	const normalizedSearchQuery = normalize(searchQuery.value);
	const filtered = props.stations.filter((item) => {
		return normalize(item.name).includes(normalizedSearchQuery)
			|| normalize(item.address).includes(normalizedSearchQuery)
			|| normalize(item.city).includes(normalizedSearchQuery)
			|| normalize(item.state).includes(normalizedSearchQuery)
			|| normalize(item.zip).includes(normalizedSearchQuery);
	});

	const PAGE_SIZE = 5;
	filteredStations.value = filtered.slice(0, (stationsPage.value + 1) * PAGE_SIZE);
});
</script>

<template>
	<div class="modal-content">
		<BaseInput
			v-model="searchQuery"
			:disabled="loadingStations"
			:input-type="InputType.SEARCH"
		>
			Buscar gasolinera
		</BaseInput>

		<!-- Custom EESS modal -->
		<ul>
			<li
				class="btn-add-custom"
				@click="showCustomEESSModal = true"
			>
				Añadir gasolinera personalizada...
				<BaseIcon icon="fa-solid fa-chevron-right" class="icon-chevron" />

				<StationsSelectModalCustomStationModal
					v-model:show="showCustomEESSModal"
					@create-station="$event ? close($event) : (showCustomEESSModal = false)"
				/>
			</li>
		</ul>

		<!-- Stations list -->
		<ul v-if="filteredStations.length">
			<li
				v-for="item in filteredStations"
				:key="item.id"
				:class="{ selected: item.id === selectedStation?.id }"
				@click="close(item)"
			>
				<div
					v-if="getLogoForStation(item.name)"
					class="img-wrapper"
				>
					<img
						:src="getLogoForStation(item.name)"
						:alt="item.name"
						class="logo"
					>
				</div>

				<BaseIcon
					v-else
					icon="fa-solid fa-gas-pump"
					:icon-size="IconSize.L"
					class="img-wrapper"
				/>

				<span class="info">
					<span class="name">{{ item.name }}</span>
					<span class="address">
						{{ capitalizeAll(item.address) }}
						<template v-if="!hasGeolocation">
							<br>
							{{ capitalizeAll(item.city) }}, {{ capitalizeAll(item.state) }}
						</template>
					</span>
				</span>

				<span
					v-if="item.distance"
					class="distance"
				>
					{{ item.distance?.toFixed(2) }}km
				</span>

				<BaseIcon icon="fa-solid fa-chevron-right" class="icon-chevron" />
			</li>
		</ul>

		<!-- No results -->
		<template v-if="searchQuery">
			<p
				v-if="!filteredStations.length"
				class="search-helper"
			>
				No se han encontrado gasolineras cercanas con esa búsqueda...

				<BaseButton
					:mode="ButtonMode.OUTLINE"
					@click="searchQuery = ''"
				>
					Borrar búsqueda
				</BaseButton>
			</p>
		</template>

		<!-- Loading -->
		<p
			v-if="loadingStations"
			class="search-helper"
		>
			Cargando gasolineras...
		</p>

		<!-- More items -->
		<BaseButton
			v-if="filteredStations.length"
			:mode="ButtonMode.OUTLINE"
			@click="stationsPage++"
		>
			Mostrar más estaciones
		</BaseButton>
	</div>
</template>

<style scoped lang="scss">
.modal-content {
	padding: 8px 16px 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;

	.search-helper {
		font-style: italic;
		font-weight: var(--font-weight-book);
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.btn-add-custom {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	ul {
		display: flex;
		flex-direction: column;

		li {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 8px 0;

			&.selected {
				color: var(--color-primary);
			}

			.img-wrapper {
				flex-shrink: 0;
				width: 24px;
				height: 24px;

				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
			}

			.info {
				display: flex;
				flex-direction: column;
				gap: 4px;
				overflow: hidden;
				margin-right: auto;

				.address {
					font-size: var(--font-size-small);
					font-weight: var(--font-weight-book);
				}

				.name, .address {
					// Show only one line
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}

			.distance {
				font-size: var(--font-size-small);
				font-weight: var(--font-weight-book);
			}
		}
	}
}
</style>
