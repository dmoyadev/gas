<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonColor, ButtonForm, ButtonMode } from '@/components/button/types';
import BaseIcon from '@/components/icon/BaseIcon.vue';

defineProps<{
	sheet: { name: string; component: any };
}>();

const show = ref(false);
</script>

<template>
	<h1 @click="show = !show">
		{{ sheet.name }}
		<BaseButton
			:mode="ButtonMode.CLEAR"
			:color="ButtonColor.GRAYSCALE"
			:form="ButtonForm.INLINE"
		>
			<BaseIcon :icon="`fa-solid ${show ? 'fa-chevron-up' : 'fa-chevron-down'}`" />
		</BaseButton>
	</h1>

	<component
		:is="sheet.component"
		v-if="show"
	/>
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
