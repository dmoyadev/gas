<script setup lang="ts">
import BaseButton from '@/components/button/BaseButton.vue';
</script>

<template>
	<main class="empty-state">
		<img
			src="/assets/isotype.svg"
			alt="Logo"
			class="empty-state--image"
			height="80"
		>
		<p class="empty-state--title">
			Todavía no has añadido ningún vehículo a la aplicación...
			<span class="empty-state__highlight">¿Empezamos?</span>
		</p>

		<BaseButton
			class="empty-state--button"
			to="/vehicles/__new__"
		>
			Añadir vehículo
		</BaseButton>
	</main>
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
}

.empty-state {
	padding: 0 16px calc(var(--tab-height) + 16px);
	display: flex;
	flex-direction: column;
	gap: 24px;
	height: 100svh;
	align-items: center;
	justify-content: center;
	text-align: center;

	&--title {
		font-size: var(--font-size-big);
		display: flex;
		flex-direction: column;
		gap: 4px;
		max-width: 304px;
	}

	&__highlight {
		font-size: var(--font-size-big);
		color: var(--color-primary);
	}
}
</style>
