<script setup lang="ts">
import BackgroundImage from '@/modules/auth/components/BackgroundImage.vue';
</script>

<template>
	<header>
		<BackgroundImage />
		
		<img
			class="logo"
			src="/assets/logo.svg"
			height="56"
			width="144"
			alt="'Logo"
		>
	</header>
	
	<main>
		<slot />
	</main>
</template>

<style lang="scss" scoped>
header {
	height: 260px;
	
	.auth-bg {
		position: absolute;
		top: 0;
		right: 0;
		z-index: -1;
	}
	
	.logo {
		position: absolute;
		top: 204px;
		left: 20px;
		width: 144px;
		height: 56px;
		object-fit: contain;
	}
}

main {
	padding: 20px;
	display: flex;
	flex-direction: column;
	min-height: calc(100svh - 260px);
}
</style>