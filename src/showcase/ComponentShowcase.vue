<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonColor, ButtonMode, ButtonForm } from '@/components/button/types';
import BaseIcon from '@/components/icon/BaseIcon.vue';

const show = ref(false);

defineProps<{
	sheet: { name: string, component: any }
}>();
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