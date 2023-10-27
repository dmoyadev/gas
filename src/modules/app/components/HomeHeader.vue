<script setup lang="ts">
import { Vehicle } from '@/modules/app/models/Vehicle.ts';
import { ref } from 'vue';
import { useStickyObserver } from '@/modules/app/composables/useStickyObserver.ts';

defineProps<{
	vehicle?: Vehicle
}>();

const $header = ref<HTMLElement>();
useStickyObserver($header);
</script>

<template>
	<!-- ⏳ Loading state -->
	<header
		v-if="!vehicle"
		ref="$header"
	>
		<div class="car-brand">
			<span class="skeleton-item skeleton-item--icon" />
			<span
				class="skeleton-item"
				style="width: 15ch"
			/>
		</div>
		<span
			class="model skeleton-item skeleton-item--title"
			style="width: 25ch;"
		/>
	</header>
	
	<!-- ✅ Success state -->
	<header
		v-else
		ref="$header"
	>
		<div class="car-brand">
			<div class="img-wrapper">
				<img
					:src="vehicle.brand.logo"
					:alt="vehicle.brand.name"
				>
			</div>
			<span>{{ vehicle.brand.name }}</span>
		</div>
		
		<span class="model-and-name">
			<span class="model">
				{{ vehicle.model }}
			</span>
		
			<em v-if="vehicle.alias">
				({{ vehicle.alias }})
			</em>
		</span>
	</header>
</template>

<style lang="scss" scoped>
header {
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 4px;
	position: sticky;
	top: -1px; /* More info: https://css-tricks.com/how-to-detect-when-a-sticky-element-gets-pinned/ */
	width: 100%;
	
	.car-brand {
		display: flex;
		align-items: center;
		gap: 8px;
		
		.img-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 24px;
			height: 24px;
			
			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
		}
	}
	
	.model-and-name {
		.model {
			font-size: 32px;
		}
		
		em {
			font-size: var(--font-size-body);
			font-style: italic;
			font-weight: var(--font-light);
		}
	}
	
	&.stuck {
		z-index: 100;
		
		/* From https://css.glass */
		background: rgba(35, 67, 85, 0.6);
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		
		flex-direction: row;
		align-items: center;
		gap: 8px;
		
		.model {
			font-size: var(--font-size-body)
		}
	}
}
</style>