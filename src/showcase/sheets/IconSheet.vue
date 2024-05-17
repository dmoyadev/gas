<script setup lang="ts">
import ShowcaseElements from '@/showcase/ShowcaseElements.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/BaseIcon.types.ts';
</script>

<template>
	<section class="sheet">
		<ShowcaseElements>
			<template #title>
				normal
			</template>

			<BaseIcon
				icon="fa-solid fa-gear"
				:icon-size="IconSize.XXL"
				spin
				spin-pulse
			/>

			<BaseIcon
				icon="fa-regular fa-circle-check"
				:icon-size="IconSize.XL"
			/>

			<BaseIcon
				icon="fa-solid fa-gas-pump"
				:icon-size="IconSize.L"
			/>

			<BaseIcon icon="fa-solid fa-oil-can" />

			<BaseIcon
				icon="fa-solid fa-search"
				:icon-size="IconSize.S"
			/>
		</ShowcaseElements>
	</section>
</template>

<style scoped lang="scss">
.sheet {
	padding: 16px 0;
	display: flex;
	flex-direction: column;
	gap: 8px;
	overflow-x: auto;
}
</style>
