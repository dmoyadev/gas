<script setup lang="ts">
</script>

<template>
	<router-view :key="$route.fullPath" />
</template>

<style lang="scss">
body, #app {
	background: var(--color-secondary);
	color: var(--color-secondary-accent);
	min-width: 100dvw;
}
</style>
