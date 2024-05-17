<script setup lang="ts">
import { ref } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import BaseStepper from '@/components/stepper/BaseStepper.vue';
import Step1Partial from '@/modules/vehicles/partials/create-vehicle/Step1Partial.vue';
import Step2Partial from '@/modules/vehicles/partials/create-vehicle/Step2Partial.vue';
import Step3Partial from '@/modules/vehicles/partials/create-vehicle/Step3Partial.vue';
import Step4Partial from '@/modules/vehicles/partials/create-vehicle/Step4Partial.vue';
import Step5Partial from '@/modules/vehicles/partials/create-vehicle/Step5Partial.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonForm, ButtonMode } from '@/components/button/BaseButton.types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import type { Vehicle } from '@/modules/app/models/Vehicle.ts';
import { useStorage } from '@/modules/app/composables/useStorage.ts';

const vehicle = useStorage<Vehicle>('new-vehicle', {} as Vehicle);
onBeforeRouteLeave(() => localStorage.removeItem('new-vehicle'));

const route = useRoute();
const router = useRouter();
function getInitialStep(): number {
	let routeStep = +(route.query?.step ?? 1);

	if (routeStep === 3 && !vehicle.value!.fuelType) {
		routeStep = 2;
	}

	if (routeStep === 2 && !vehicle.value!.vehicleType) {
		routeStep = 1;
	}

	return routeStep;
}

const currentStep = ref(getInitialStep());

async function submitStep(step: number) {
	if (!isNaN(step)) {
		await router.push({
			path: route.path,
			query: { step: step + 1 },
		});
	}
}
</script>

<template>
	<div class="content">
		<header>
			<BaseButton
				v-if="currentStep < 5"
				:mode="ButtonMode.CLEAR"
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
			<span v-if="currentStep < 5" />
		</header>

		<!-- Step 1 -->
		<Step1Partial
			v-if="currentStep === 1"
			v-model="vehicle!.vehicleType"
			@send-step="submitStep(1)"
		/>

		<!-- Step 2 -->
		<Step2Partial
			v-if="currentStep === 2"
			v-model="vehicle!.fuelType"
			@send-step="submitStep(2)"
			@step-back="currentStep = 1"
		/>

		<!-- Step 3 -->
		<Step3Partial
			v-if="currentStep === 3"
			v-model:brand="vehicle!.brand"
			v-model:model="vehicle!.model"
			v-model:year="vehicle!.year"
			:vehicle-type="vehicle!.vehicleType"
			@send-step="submitStep(3)"
			@step-back="currentStep = 2"
		/>

		<!-- Step 4 -->
		<Step4Partial
			v-if="currentStep === 4"
			v-model:plate="vehicle!.plate"
			v-model:odometer="vehicle!.odometer"
			v-model:battery-capacity="vehicle!.batteryCapacity"
			v-model:alias="vehicle!.alias"
			:fuel-type="vehicle!.fuelType"
			@send-step="submitStep(4)"
			@step-back="currentStep = 3"
		/>

		<!-- Step 5 -->
		<Step5Partial
			v-if="currentStep === 5"
			@step-back="currentStep = 4"
		/>

		<BaseStepper
			class="stepper"
			:current="currentStep"
			:total="4"
		/>
	</div>
</template>

<style lang="scss" scoped>
.content {
	min-height: 100svh;
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
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 16px;

	.instructions {
		h1 {
			font-size: var(--font-size-big);
			font-weight: var(--font-heavy);
			margin-bottom: 8px;
		}

		p {
			color: var(--color-primary);
			font-weight: var(--font-light);
		}
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
