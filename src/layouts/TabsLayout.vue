<script setup lang="ts">
import BaseIcon from '@/components/icon/BaseIcon.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonColor, ButtonForm, ButtonMode } from '@/components/button/types.ts';

const tabs = [
	{
		icon: 'fa-solid fa-car',
		text: 'Inicio',
		route: '/',
	},
	{
		icon: 'fa-solid fa-gas-pump',
		text: 'Gestión',
		route: '/management',
	},
	{
		icon: 'fa-solid fa-book-bookmark',
		text: 'Historial',
		route: '/history',
	},
	{
		icon: 'fa-solid fa-gears',
		text: 'Ajustes',
		route: '/settings',
	},
];
</script>

<template>
	<router-view />
	
	<nav>
		<BaseButton
			v-for="(tab, index) in tabs"
			:key="index"
			:to="tab.route"
			:form="ButtonForm.INLINE"
			:mode="ButtonMode.CLEAR"
			:color="ButtonColor.GRAYSCALE"
		>
			<BaseIcon :icon="tab.icon" />
			<span>{{ tab.text }}</span>
		</BaseButton>
	</nav>
</template>

<style lang="scss" scoped>
nav {
	z-index: 100;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: var(--tab-height);
	background: var(--color-secondary);
	box-shadow: 0 -8px 8px -4px rgba(0, 0, 0, 0.2);
	display: flex;
	align-items: center;
	
	a {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-weight: var(--font-medium);
		
		&.router-link-exact-active {
			color: var(--color-primary) !important;
		}
		
		span {
			font-size: var(--font-size-small);
		}
	}
}
</style>

<style>
:root {
	--tab-height: 56px;
}
</style>