<script setup lang="ts">
import InputSheet from '@/showcase/sheets/InputSheet.vue';
import ComponentShowcase from '@/showcase/ComponentShowcase.vue';
import ButtonSheet from '@/showcase/sheets/ButtonSheet.vue';

const sheets = [
	{
		name: 'Button',
		component: ButtonSheet,
	},

	{
		name: 'Input',
		component: InputSheet,
	},
];
</script>

<template>
	<main>
		<ComponentShowcase
			v-for="(sheet, index) in sheets"
			:key="index"
			:sheet="sheet"
		/>
	</main>
</template>

<style scoped lang="scss">
main {
	padding: 16px;
	display: flex;
	flex-direction: column;

	h1 {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	h1:not(:first-child) {
		margin-top: 16px;
	}
}
</style>
