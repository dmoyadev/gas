<script setup lang="ts">
import { computed } from 'vue';
import { useRecentRefills } from '@/modules/refills/composables/useRecentRefills.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
import type { Refill } from '@/modules/refills/models/Refill.ts';
import { getLogoForStation } from '@/utils/helpers.ts';

const { refills } = useRecentRefills();

const lastRefill = computed<Refill | undefined>(() => refills.value[0] || undefined);
const title = computed(() => {
	return lastRefill.value?.fuelType.type
		? 'Último repostaje'
		: 'Última recarga';
});
const isRecharge = computed<boolean>(() => lastRefill.value?.fuelType.type === 'electric');
const units = computed<string>(() => isRecharge.value ? 'kW' : 'L');
</script>

<template>
	<!-- ✅ Success state -->
	<section v-if="lastRefill">
		<header>
			<h3>{{ title }}</h3>
			<span class="date">
				{{ (lastRefill.created_at).toDate().toLocaleDateString('es-ES', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
				}) }}
			</span>
			<div class="station">
				<div
					v-if="getLogoForStation(lastRefill.station?.name)"
					class="img-wrapper"
				>
					<img
						:src="getLogoForStation(lastRefill.station?.name)"
						:alt="lastRefill.station.name"
						class="logo"
					>
				</div>

				<BaseIcon
					v-else
					:icon="isRecharge ? 'fa-solid fa-charging-station' : 'fa-solid fa-gas-pump'"
					:icon-size="IconSize.S"
					class="img-wrapper"
					:class="{ 'icon-success': isRecharge }"
				/>

				{{ lastRefill.station?.name || '???' }}
			</div>
		</header>

		<table>
			<thead>
				<tr>
					<th>{{ isRecharge ? 'BATERÍA RECARGADA' : 'TIPO' }}</th>
					<th>PRECIO</th>
					<th v-if="!isRecharge">
						CANTIDAD
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<BaseIcon
							:class="{ 'icon-success': isRecharge }"
							:icon="isRecharge ? 'fa-solid fa-charging-station' : 'fa-solid fa-gas-pump'"
							:icon-size="IconSize.S"
						/>
						<template v-if="isRecharge">
							{{ lastRefill.chargeInitial }}% - {{ lastRefill.chargeFinal }}%
						</template>
						<template v-else>
							{{ lastRefill.fuelType?.name }}
						</template>
					</td>

					<td>
						{{ lastRefill.unitCost.toLocaleString('es-ES', {
							currency: 'EUR',
							style: 'currency',
							minimumFractionDigits: 3,
						}) }}/{{ units }}
					</td>

					<td v-if="!isRecharge">
						{{ lastRefill.units.toLocaleString('es-ES', {
							minimumFractionDigits: 2,
						}) }} L
					</td>
				</tr>
			</tbody>
			<tfoot>
				<tr>
					<td colspan="2">
						COSTE TOTAL
					</td>
					<td>
						{{ lastRefill.totalCost.toLocaleString('es-ES', {
							currency: 'EUR',
							style: 'currency',
							minimumFractionDigits: 2,
						}) }}/{{ units }}
					</td>
				</tr>
			</tfoot>
		</table>
	</section>
</template>

<style lang="scss" scoped>
section {
	background: var(--color-secondary-accent);
	color: var(--color-secondary);
	font-family: var(--font-family-monospace);
	font-weight: var(--font-weight-light);
	padding: 8px;
	position: relative;

	// Make the effect of a folded paper corner at the top right
	&::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 0;
		height: 0;
		border-top: 18px solid var(--color-secondary);
		border-left: 18px solid var(--color-secondary-accent);
		box-shadow: -4px 4px 6px 0 rgba(0,0,0,0.50);
	}

	header {
		padding: 8px 4px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;

		h3 {
			font-size: var(--font-size-body);
			font-weight: var(--font-weight-heavy);
			font-style: italic;
		}

		.station {
			width: 100%;
			display: flex;
			align-items: center;
			gap: 6px;

			.img-wrapper {
				flex-shrink: 0;
				width: 14px;
				height: 14px;

				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
			}
		}
	}

	table {
		width: 100%;
		border-collapse: collapse;

		thead {
			padding: 0 4px;
			border-top: 1px dashed var(--color-secondary);
			border-bottom: 1px dashed var(--color-secondary);
		}

		th,
		td {
			padding: 4px;
			font-size: var(--font-size-small);

			&:last-child {
				text-align: right;
			}

			i {
				margin-right: 4px;
				position: relative;
				bottom: -1px;
			}
		}

		tbody {
			td {
				padding: 8px 4px;
			}
		}

		tfoot {
			td:last-child {
				font-weight: var(--font-weight-heavy);
			}
		}
	}
}
</style>
