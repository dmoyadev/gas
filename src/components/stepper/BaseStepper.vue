<script setup lang="ts">
withDefaults(
	defineProps<{
		/**
		 * Indicates the current step in the stepper
		 */
		currentStep?: number;
		/**
		 * Indicates the number of steps in the stepper
		 */
		totalSteps?: number;
	}>(),
	{
		currentStep: 1,
		totalSteps: 1,
	},
);
</script>

<template>
	<nav class="stepper">
		<div
			v-for="n in totalSteps"
			:key="n"
			:class="{ active: n <= currentStep }"
		/>
	</nav>
</template>

<style scoped lang="scss">
nav {
	display: flex;
	justify-content: center;
	gap: 16px;

	div {
		width: 16px;
		height: 16px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		background: var(--color-secondary-accent);
		font-weight: bold;

		&.active {
			border: none;
			animation: pop .5s ease-in-out forwards;

			@keyframes pop {
			0% {
				transform: scale(1);
				background: var(--color-secondary-accent);
			}
			50% {
				transform: scale(1.2);
				background-color: var(--color-primary);
			}
			100% {
				transform: scale(1);
				background-color: var(--color-primary);
			}
		}
		}
	}
}
</style>
