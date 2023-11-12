<script setup lang="ts">
import { IconSize } from '@/components/icon/types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
</script>

<template>
	<div>
		<BaseIcon
			class="icon-gear"
			icon="fa-solid fa-gear"
			:icon-size="IconSize.XXL"
			spin
			spin-pulse
		/>
		<BaseIcon
			class="icon-gear"
			icon="fa-solid fa-gear"
			:icon-size="IconSize.XXL"
			spin
			spin-reverse
			spin-pulse
		/>
	</div>
</template>

<style lang="scss" scoped>
div {
	display: flex;
	height: 80px;
	
	.icon-gear:last-child {
		margin-left: -8px;
		align-self: flex-end;
	}
}
</style>