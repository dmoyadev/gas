<script setup lang="ts">
</script>

<template>
	<router-view :key="$route.fullPath" />
</template>

<style lang="scss">
html {
	background: var(--color-secondary);
	color: var(--color-secondary-accent);
}
</style>
