<script setup lang="ts">
import { computed } from 'vue';
import type { Refill } from '@/modules/refills/models/Refill.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
import { getLogoForStation, stringToNumber } from '@/utils/helpers.ts';

const props = defineProps<{
	refill?: Refill;
	previousOdometer?: number | string;
	loading?: boolean;
}>();

const isElectric = computed<boolean>(() => props.refill?.fuelType?.type === 'electric');

const icon = computed<string>(() => {
	return isElectric.value
		? 'fa-solid fa-plug-circle-bolt'
		: 'fa-solid fa-gas-pump';
});

const units = computed<string>(() => {
	return isElectric.value
		? ' / kW'
		: ' / L';
});

const unitsPer100 = computed<string>(() => {
	if (!props.previousOdometer) {
		return 'Usando...';
	}
	if (!props.refill?.odometer) {
		return '??? L/100';
	}

	const realizedUnits = stringToNumber(props.previousOdometer) - props.refill.odometer;
	const units = (100 * stringToNumber(props.refill.units) / realizedUnits)
		.toLocaleString('es-ES', { maximumFractionDigits: 1 });
	return isElectric.value
		? `${units} kW/100`
		: `${units} L/100`;
});
</script>

<template>
	<!-- ⏳ Loading state -->
	<template v-if="loading">
		<li>
			<span class="skeleton-item skeleton-item--icon" />

			<div class="info">
				<span
					class="skeleton-item skeleton-item--small"
					style="width: 8ch;"
				/>
				<span
					class="skeleton-item skeleton-item--small"
					style="width: 15ch;"
				/>
				<span
					class="skeleton-item skeleton-item--small"
					style="width: 12ch;"
				/>
			</div>

			<div class="price">
				<span
					class="title"
					style="width: 8ch;"
				/>
				<span
					class="skeleton-item skeleton-item--small"
					style="width: 15ch;"
				/>
			</div>
		</li>
	</template>

	<!-- ✅ Loaded state -->
	<template v-else-if="refill">
		<li>
			<!-- Station logo -->
			<div
				v-if="getLogoForStation(refill.station?.name)"
				class="img-wrapper"
			>
				<img
					:src="getLogoForStation(refill.station?.name)"
					:alt="refill.station.name"
					class="logo"
				>
			</div>

			<BaseIcon
				v-else
				:icon="icon"
				:icon-size="IconSize.L"
				class="img-wrapper"
				:class="{ 'icon-success': isElectric }"
			/>

			<!-- Refill info -->
			<div class="info">
				<span class="title">
					{{ refill.station?.name || '???' }}
				</span>

				<span>{{ refill.fuelType?.name }}</span>

				<span v-if="refill.created_at">
					{{
						(refill.created_at).toDate().toLocaleDateString('es-ES', {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
						})
					}}
				</span>
			</div>

			<!-- Refill Stats -->
			<div
				class="price"
				:class="{ electric: isElectric }"
			>
				<!-- Price per unit -->
				<span class="title">
					{{
						stringToNumber(refill?.unitCost)?.toLocaleString('es-ES', {
							currency: 'EUR',
							style: 'currency',
							minimumFractionDigits: 3,
						})
					}} {{ units }}
				</span>

				<!-- Units consumed -->
				<span class="units">
					<template v-if="isElectric">
						<BaseIcon
							class="icon-success"
							icon="fa-solid fa-battery-2"
							:icon-size="IconSize.S"
						/>
						{{ refill.chargeInitial }}%
						-
						{{ refill.chargeFinal }}%
						<BaseIcon
							class="icon-success"
							icon="fa-solid fa-battery-full"
							:icon-size="IconSize.S"
						/>
					</template>

					<template v-else>
						<BaseIcon
							icon="fa-solid fa-oil-can"
							:icon-size="IconSize.S"
						/>
						{{ refill.units }} L
					</template>

					<span
						v-if="previousOdometer && refill.odometer"
						class="stat"
					>
						{{ stringToNumber(previousOdometer) - refill.odometer }}km
					</span>
				</span>

				<!-- Consumption -->
				<span class="consumption">
					{{
						stringToNumber(refill?.totalCost)?.toLocaleString('es-ES', {
							currency: 'EUR',
							style: 'currency',
							maximumFractionDigits: 2,
						})
					}}
					-
					{{ unitsPer100 }}
				</span>
			</div>
		</li>
	</template>
</template>

<style lang="scss" scoped>
li {
	display: flex;
	align-items: center;
	gap: 16px;

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
		flex: 1;
		font-size: var(--font-size-small);

		:not(.title) {
			font-weight: var(--font-weight-light);
			font-size: var(--font-size-legal);
		}
	}

	.price {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: space-between;
		gap: 2px;
		margin-left: auto;
		flex-shrink: 0;

		.title {
			font-weight: var(--font-weight-heavy);
			font-size: var(--font-size-title);
		}

		:not(.title) {
			font-weight: var(--font-weight-light);
			font-size: var(--font-size-small);
		}

		.units {
			display: flex;
			align-items: center;
			gap: 2px;
			font-size: var(--font-size-legal);

			.stat {
				margin-left: 8px;
			}
		}

		.consumption {
			font-size: var(--font-size-legal);
		}
	}
}
</style>
