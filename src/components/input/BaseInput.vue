<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/components/button/BaseButton.vue';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { InputForm, InputType } from '@/components/input/types';
import { ButtonColor, ButtonForm, ButtonMode } from '@/components/button/types';
import { hasSlotContent } from '@/utils/helpers.ts';

withDefaults(
	defineProps<{
		/**
		 * The value of the input
		 */
		modelValue: string | number | null,
		/**
		 * The type of the input
		 */
		inputType?: InputType;
		/**
		 * The form of the input
		 */
		form?: InputForm;
		/**
		 * Indicates if the input has an error. Determines if the `error` slot
		 * will be shown
		 */
		hasError?: boolean;
		/**
		 * Indicates if the input is required
		 */
		isRequired?: boolean;
		/**
		 * Indicates if the input is loading
		 */
		loading?: boolean;
	}>(),
	{
		modelValue: '',
		inputId: '',
		form: InputForm.BLOCK,
		inputType: InputType.TEXT,
	},
);

defineEmits<{
	/**
	 * Emitted when the input value changes
	 * @arg {string | number} value - The new value of the input
	 */
	'update:modelValue': [value: string | number]
}>();

const _componentUID =  Date.now().toString(36) + Math.random().toString(36).substring(2);

const showPassword = ref(false);
</script>

<template>
	<div>
		<label>
			<span
				class="input-wrapper"
				:class="{
					[`input-form-${form}`]: true,
					'has-value': !!modelValue,
					'has-error': hasError,
				}"
			>
				<!-- Actual input -->
				<input
					:id="($attrs.id as string) || _componentUID"
					v-bind="$attrs"
					:type="(showPassword ? InputType.TEXT : inputType)"
					:value="modelValue"
					:readonly="!!($attrs.readonly || loading)"
					:disabled="!!($attrs.disabled || loading)"
					:required="!!isRequired"
					aria-label=""
					@input="$emit('update:modelValue', (($event.target as HTMLInputElement).value))"
				>
				
				<!-- Icon right -->
				<span
					v-if="$slots.append 
						|| loading
						|| [InputType.TEXT, InputType.SEARCH, InputType.PASSWORD].includes(inputType)"
					class="append"
				>
					<!-- @slot Element shown on the inside right of the input -->
					<slot
						v-if="!loading"
						name="append"
					>
						<!-- Search icon -->
						<BaseIcon
							v-if="inputType === InputType.SEARCH"
							icon="fa-solid fa-search"
						/>
						
						<!-- Toggle password visibility button -->
						<BaseButton
							v-if="inputType === InputType.PASSWORD"
							:color="ButtonColor.PRIMARY"
							:mode="ButtonMode.CLEAR"
							:form="ButtonForm.INLINE"
							:disabled="(!!($attrs.disabled || loading || $attrs.readonly))"
							type="button"
							class="input-button"
							@click="showPassword = !showPassword"
						>
							<BaseIcon :icon="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" />
						</BaseButton>
					</slot>
					
					<BaseIcon
						v-else
						icon="fa-solid fa-gear"
						spin-pulse
						spin-reverse
					/>
				</span>
			</span>
			
			<!-- Label -->
			<span
				v-if="!loading && hasSlotContent($slots.default)"
				class="label"
			>
				<!-- @slot Label of the input -->
				<slot />
			</span>
		</label>
		
		<!-- Error slot -->
		<p
			v-if="!loading && hasError && hasSlotContent($slots.error)"
			class="error"
		>
			<!-- @slot Error message of the input -->
			<slot name="error" />
		</p>
	</div>
</template>

<style scoped lang="scss">
div {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: 4px;
	
	label {
		position: relative;
		
		.input-wrapper {
			width: 100%;
			overflow: hidden;
			
			&.input-form {
				&-notched-left,
				&-notched-right {
					display: inline-flex;
					position: relative;
					
					&:before {
						content: '';
						position: absolute;
						background: var(--color-secondary);
						top: 50%;
						transform: translateY(-50%);
						width: 60px;
						height: 60px;
						border-radius: 100%;
						border: 1px solid var(--color-secondary-accent);
					}
				}
				
				&-notched-left {
					input {
						border-radius: 0 4px 4px 0;
						padding-left: 22px;
					}
					
					& ~ .label {
						left: 24px;
					}
					
					&:before {
						left: -50px;
					}
				}
				
				&-notched-right {
					input {
						border-radius: 4px 0 0 4px;
						padding-right: 22px;
					}
					
					& .append {
						right: 8px;
						
						&:not(:has(.input-button)) {
							right: 20px;
						}
					}
					
					&:before {
						right: -50px;
					}
				}
			}
			
			&.has-error {
				input {
					border-color: var(--color-danger) !important;
				}
				
				&.input-form {
					&-notched-left,
					&-notched-right {
						&:before {
							border-color: var(--color-danger) !important;
						}
					}
				}
			}
			
			&:not(:has(:disabled)):focus-within {
				input {
					border-color: var(--color-primary);
				}
				
				&.input-form {
					&-notched-left,
					&-notched-right {
						&:before {
							border-color: var(--color-primary);
						}
					}
				}
			}
			
			&:not(:has(:disabled)):focus-within,
			&.has-value {
				& ~ .label {
					top: -12px;
					transform: none;
					font-size: var(--font-size-small);
					z-index: 10;
					
					&:before {
						content: '';
						position: absolute;
						width: calc(100% + 8px);
						height: 100%;
						top: 0;
						left: -4px;
						background: var(--color-secondary);
						z-index: -1;
					}
				}
			}
			
			input {
				height: 42px;
				width: 100%;
				border: 1px solid var(--color-secondary-accent);
				border-radius: 4px;
				padding: 12px;
				font-size: var(--font-size-body);
				
				&::placeholder {
					color: transparent;
				}
			}
			
			.append {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 0;
				
				&:not(:has(.input-button)) {
					right: 12px;
					height: 16px;
					width: 16px;
				}
			}
		}
		
		.label {
			position: absolute;
			left: 12px;
			top: 50%;
			transform: translateY(-50%);
			transition: all .15s ease-out;
		}
		
		&:has(input:read-only),
		&:has(input:disabled) {
			opacity: .5;
		}
	}
	
	.error {
		color: var(--color-danger);
		font-size: var(--font-size-small);
		line-height: var(--font-size-small);
	}
}

/* Delete search clear x */
/* clears the ‘X’ from Chrome */
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
	display: none;
}
</style>
