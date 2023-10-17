<script setup lang="ts">
import { ref } from 'vue';
import BaseStepper from '@/components/stepper/BaseStepper.vue';
import StepOnePartial from '@/modules/management/pages/partials/create-vehicle/StepOnePartial.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonForm, ButtonMode } from '@/components/button/types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';

const vehicleType = ref<'car' | 'motorcycle' | undefined>();

const currentStep = ref(0);
function submitStep(step: number) {
	currentStep.value = step + 1;
}
</script>

<template>
	<div class="content">
		<header>
			<BaseButton
				v-if="currentStep < 4"
				:mode="ButtonMode.OUTLINE"
				:form="ButtonForm.CIRCLE"
				to="/"
			>
				<BaseIcon icon="fa-solid fa-arrow-left" />
			</BaseButton>
			
			<img
				src="/assets/logo.svg"
				alt="logo"
			>
			
			<!-- This is a placeholder for the logo to be centered -->
			<span v-if="currentStep < 4" />
		</header>
		
		<!-- Step 1 -->
		<StepOnePartial
			v-if="currentStep === 0"
			v-model="vehicleType"
			@send-step="submitStep(0)"
		/>
		
		<BaseStepper
			class="stepper"
			:current-step="currentStep"
			:total-steps="4"
		/>
	</div>
</template>

<style lang="scss" scoped>
.content {
	height: 100svh;
	display: flex;
	flex-direction: column;
}

header {
	padding: 32px 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	&:not(:has(span)) {
		justify-content: center;
	}
	
	img {
		width: 104px;
	}
	
	span {
		width: 42px;
	}
}

:deep(main) {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 16px;
	
	h1 {
		font-size: var(--font-size-big);
		font-weight: var(--font-heavy);
		margin-bottom: 8px;
	}
	
	p {
		color: var(--color-primary);
		font-weight: var(--font-light);
	}
	
	h2 {
		margin-top: 32px;
		font-size: 22px;
		text-align: center;
	}
}

.stepper {
	margin-top: auto;
	padding: 32px;
}
</style>