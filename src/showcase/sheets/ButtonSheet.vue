<script setup lang="ts">
import BaseButton from '@/components/button/BaseButton.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { ButtonColor, ButtonForm, ButtonMode } from '@/components/button/types';
import { capitalize } from '@/utils/helpers';
import ShowcaseElements from '@/showcase/ShowcaseElements.vue';
</script>

<template>
	<section class="sheet">
		<template
			v-for="(color, c) in ButtonColor"
			:key="c"
		>
			<template
				v-for="(mode, m) in ButtonMode"
				:key="m"
			>
				<template
					v-for="(form, f) in ButtonForm"
					:key="f"
				>
					<ShowcaseElements>
						<template #title>
							{{ `${capitalize(color)} ${mode} ${form}` }}
						</template>

						<BaseButton
							v-if="form !== ButtonForm.CIRCLE"
							:color="color"
							:mode="mode"
							:form="form"
						>
							Button
						</BaseButton>

						<BaseButton
							v-if="form !== ButtonForm.CIRCLE"
							:color="color"
							:mode="mode"
							:form="form"
							disabled
						>
							Disabled
						</BaseButton>

						<BaseButton
							v-if="form !== ButtonForm.CIRCLE"
							:color="color"
							:mode="mode"
							:form="form"
							loading
						>
							Loading
						</BaseButton>

						<BaseButton
							:color="color"
							:mode="mode"
							:form="form"
						>
							<BaseIcon icon="fa-regular fa-circle-dot" />
						</BaseButton>
					</ShowcaseElements>
				</template>
			</template>
		</template>
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

.icon {
	margin-right: 8px;
}
</style>
