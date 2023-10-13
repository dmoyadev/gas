<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from '@/components/input/BaseInput.vue';
import { InputForm, InputType } from '@/components/input/types';
import { capitalize } from '@/utils/helpers';
import ShowcaseElements from '@/showcase/ShowcaseElements.vue';

const showLabelOptions = [ false, true ];
const readonlyOptions = [ false, true ];
const hasErrorOptions = [ false, true ];
const isLoadingOptions = [ false, true ];

const text = ref('');
</script>

<template>
	<section class="sheet">
		<template
			v-for="(type, t) in InputType"
			:key="t"
		>
			<template
				v-for="(form, f) in InputForm"
				:key="f"
			>
				<template
					v-for="(showLabel, s) in showLabelOptions"
					:key="s"
				>
					<template
						v-for="(isReadonly, r) in readonlyOptions"
						:key="r"
					>
						<template
							v-for="(hasError, e) in hasErrorOptions"
							:key="e"
						>
							<template
								v-for="(isLoading, l) in isLoadingOptions"
								:key="l"
							>
								<ShowcaseElements>
									<template #title>
										{{ capitalize(type) }}
										{{ capitalize(form) }}
										{{ showLabel ? 'with label' : '' }}
										{{ isReadonly ? 'readonly' : '' }}
										{{ hasError ? 'with error' : '' }}
										{{ isLoading ? 'loading' : '' }}
									</template>
									
									<BaseInput
										v-model="text"
										placeholder="Input placeholder"
										:input-type="type"
										:readonly="isReadonly"
										:form="form"
										:has-error="hasError"
										:loading="isLoading"
										class="input"
									>
										<template v-if="showLabel">
											Input label
										</template>
										
										<template
											v-if="hasError"
											#error
										>
											This is an error message
										</template>
									</BaseInput>
								</ShowcaseElements>
							</template>
						</template>
					</template>
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

.input {
	width: 100%;
}
</style>
