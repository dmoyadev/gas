<script setup lang="ts">
import ShowcaseElements from '@/showcase/ShowcaseElements.vue';
import BaseSpinner from '@/components/spinner/BaseSpinner.vue';
</script>

<template>
	<section class="sheet">
		<ShowcaseElements>
			<template #title>
				normal
			</template>

			<BaseSpinner />
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
