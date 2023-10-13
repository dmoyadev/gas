<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { IconSize } from '@/components/icon/types';

withDefaults(
	defineProps<{
		/**
		 * The size of the icon.
		 */
		iconSize?: IconSize;
		/**
		 * The icon to display.
		 */
		icon?: string;
	}>(), {
		iconSize: IconSize.M,
		icon: undefined,
	},
);
</script>

<template>
	<i :class="iconSize">
		<FontAwesomeIcon
			v-if="icon"
			v-bind="$attrs"
			:icon="icon"
			fixed-width
		/>
		<slot v-else />
	</i>
</template>

<style scoped lang="scss">
i {
	--icon-s: 8px;
	--icon-m: 16px;
	--icon-l: 24px;
	--icon-xl: 32px;
	--icon-xxl: 48px;

	display: inline-flex;
	align-items: center;
	justify-content: center;

	&.s,
	&.s svg {
		width: var(--icon-s);
		height: var(--icon-s);
		font-size: var(--icon-s);
	}
	
	&.m,
	&.m svg {
		width: var(--icon-m);
		height: var(--icon-m);
		font-size: var(--icon-m);
	}
	
	&.l,
	&.l svg {
		width: var(--icon-l);
		height: var(--icon-l);
		font-size: var(--icon-l);
	}
	
	&.xl,
	&.xl svg {
		width: var(--icon-xl);
		height: var(--icon-xl);
		font-size: var(--icon-xl);
	}
	
	&.xxl,
	&.xxl svg {
		width: var(--icon-xxl);
		height: var(--icon-xxl);
		font-size: var(--icon-xxl);
	}
}
</style>

<style>
.icon-success {
	color: var(--color-success);
}
</style>
