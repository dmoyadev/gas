<script setup lang="ts">
import { computed } from 'vue';
import type { Refill } from '@/modules/refills/models/Refill.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';

const props = defineProps<{
	refill?: Refill;
	previousOdometer?: number;
	loading?: boolean;
}>();

const icon = computed<string>(() => {
	if (props.refill?.fuelType?.type === 'electric') {
		return 'fa-solid fa-plug-circle-bolt';
	} else {
		return 'fa-solid fa-gas-pump';
	}
});

const units = computed<string>(() => {
	if (props.refill?.fuelType?.type === 'electric') {
		return ' / kW';
	} else {
		return ' / L';
	}
});

const kmUsed = computed<string>(() => {
	if (!props.previousOdometer) {
		return 'Usando...';
	}
	if (!props.refill?.odometer) {
		return '??? Km';
	}

	return (`${(props.previousOdometer - props.refill?.odometer).toLocaleString('es-ES')} Km`);
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
			<div
				v-if="refill.station?.logo"
				class="logo-wrapper"
			>
				<img
					:src="refill.station?.logo"
					alt="Logo de la estación de servicio"
					class="logo"
				>
			</div>
			<BaseIcon
				v-else
				:class="{ 'icon-success': refill.fuelType.type === 'electric' }"
				:icon="icon"
				:icon-size="IconSize.L"
			/>

			<div class="info">
				<span class="title">
					{{ refill.station?.name || '???' }}
				</span>
				<span>{{ refill.fuelType?.name }}</span>
				<span v-if="refill.created_at">{{ (refill.created_at).toDate().toLocaleDateString('es-ES', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
				}) }}</span>
			</div>

			<div
				class="price"
				:class="{ electric: refill.fuelType.type === 'electric' }"
			>
				<span class="title">
					{{ refill?.unitCost?.toLocaleString('es-ES', {
						currency: 'EUR',
						style: 'currency',
						minimumFractionDigits: 3,
					}) }} {{ units }}
				</span>
				<span
					v-if="refill.fuelType.type === 'electric'"
					class="units"
				>
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
				</span>
				<span
					v-else
					class="units"
				>
					<BaseIcon
						icon="fa-solid fa-oil-can"
						:icon-size="IconSize.S"
					/>
					{{ refill.units }} L
				</span>
				<span>
					{{ refill?.totalCost?.toLocaleString('es-ES', {
						currency: 'EUR',
						style: 'currency',
						maximumFractionDigits: 2,
					}) }}
					-
					{{ kmUsed }}
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

	.logo-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;

		.logo {
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
		}
	}
}
</style>
