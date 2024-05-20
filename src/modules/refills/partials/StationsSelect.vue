<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import type { RefillStation } from '@/modules/refills/models/RefillStation.ts';
import { eess } from '@/utils/consts/eess.ts';
import { capitalizeAll, haversineDistance, normalize } from '@/utils/helpers.ts';
import BaseSelect from '@/components/select/BaseSelect.vue';
import { InputType } from '@/components/input/BaseInput.types.ts';
import BaseInput from '@/components/input/BaseInput.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonMode } from '@/components/button/BaseButton.types.ts';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';

const modelValue = defineModel<RefillStation>();

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

const loadingStations = ref(false);
const stationsPage = ref(0);
const searchQuery = ref('');
watch(searchQuery, () => stationsPage.value = 0);

const filteredStations = ref<RefillStation[]>([]);
watchEffect(() => {
	const normalizedSearchQuery = normalize(searchQuery.value);
	const filtered = stations.value.filter((item) => {
		return normalize(item.name).includes(normalizedSearchQuery)
			|| normalize(item.address).includes(normalizedSearchQuery)
			|| normalize(item.city).includes(normalizedSearchQuery)
			|| normalize(item.state).includes(normalizedSearchQuery)
			|| normalize(item.zip).includes(normalizedSearchQuery);
	});

	const PAGE_SIZE = 5;
	filteredStations.value = filtered.slice(0, (stationsPage.value + 1) * PAGE_SIZE);
});

function getLogoForEESS(name: string): string | undefined {
	const normalizedName = normalize(name);
	const savedLogos = [
		'agla',
		'alcampo',
		'avia',
		'ballenoil',
		'bonarea',
		'bp',
		'campsa',
		'carrefour',
		'cepsa',
		'disa',
		'eroski',
		'galp',
		'meroil',
		'naturgy',
		'petronor',
		'petroprix',
		'plenoil',
		'q8',
		'repsol',
		'shell',
		'tamoil',
		'valcarce',
	];
	for (const logo of savedLogos) {
		if (normalizedName.includes(logo)) {
			return `/eess/${logo}.svg`;
		}
	}

	if (normalizedName.includes('sca')
		|| normalizedName.includes('cooperativa')
		|| normalizedName.includes('coop')
		|| normalizedName.includes('s.c.a.')) {
		return '/eess/cooperativa.svg';
	}

	return undefined;
}

const showCustomEESSModal = ref(false);
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
					v-if="getLogoForEESS(modelValue.name)"
					class="img-wrapper"
				>
					<img
						:src="getLogoForEESS(modelValue.name)"
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
					-
					{{ capitalizeAll(modelValue.city) }}
					-
					{{ capitalizeAll(modelValue.address) }}
				</span>
			</div>
		</template>

		<template #modal="{ close }">
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
					</li>
				</ul>

				<!-- Stations list -->
				<ul v-if="filteredStations.length">
					<li
						v-for="item in filteredStations"
						:key="item.id"
						:class="{ selected: item.id === modelValue?.id }"
						@click="close(item)"
					>
						<div
							v-if="getLogoForEESS(item.name)"
							class="img-wrapper"
						>
							<img
								:src="getLogoForEESS(item.name)"
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
