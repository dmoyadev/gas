<script setup lang="ts">
import { ref } from 'vue';
import ShowcaseElements from '@/showcase/ShowcaseElements.vue';
import BaseBigNumberInput from '@/components/big-number-input/BaseBigNumberInput.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';

const num = ref();
</script>

<template>
	<section class="sheet">
		<ShowcaseElements>
			<template #title>
				normal
			</template>

			<BaseBigNumberInput
				v-model.number="num"
				placeholder="·,···"
			>
				This is a very basic label
				<template #append>
					€
				</template>
			</BaseBigNumberInput>
		</ShowcaseElements>

		<ShowcaseElements>
			<template #title>
				with error
			</template>

			<BaseBigNumberInput
				v-model.number="num"
				placeholder="·,···"
				has-error
			>
				This is a very basic label
				<template #append>
					<BaseIcon icon="fa-solid fa-car" />
				</template>
			</BaseBigNumberInput>
		</ShowcaseElements>

		<ShowcaseElements>
			<template #title>
				loading
			</template>

			<BaseBigNumberInput
				v-model.number="num"
				placeholder="·,···"
				loading
			>
				This is a very basic label
			</BaseBigNumberInput>
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
