<script setup lang="ts">
import { hasSlotContent } from '@/utils/helpers.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';

interface Props {
	hasError?: boolean; /* Indicates if the input has an error. Determines if the `error` slot will be shown */
	loading?: boolean; /* Indicates if the input is loading */
}
defineProps<Props>();

const modelValue = defineModel<string | number>();

const _componentUID = Date.now().toString(36) + Math.random().toString(36).substring(2);
</script>

<template>
	<label>
		<span
			class="input-wrapper"
			:class="{
				'has-error': hasError,
			}"
		>
			<!-- Actual input -->
			<input
				:id="($attrs.id as string) || _componentUID"
				v-bind="$attrs"
				v-model="modelValue"
				type="text"
				step="any"
				min="0"
				:readonly="!!(('readonly' in $attrs && (!!$attrs.readonly || $attrs.readonly === '')) || loading)"
				:disabled="!!(('disabled' in $attrs && (!!$attrs.disabled || $attrs.disabled === '')) || loading)"
				aria-label=""
			>

			<!-- Icon right -->
			<span class="append">
				<BaseIcon
					v-if="loading"
					icon="fa-solid fa-gear"
					spin-pulse
					spin-reverse
					class="icon-loading"
				/>

				<!-- @slot Element shown on the inside right of the input -->
				<slot v-else name="append" />
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
</template>

<style scoped lang="scss">
label {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: 4px;

	.input-wrapper {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		gap: 4px;
		border-bottom: 1px solid var(--color-secondary-accent);
		padding: 4px 0 4px 12px;

		&.has-error {
			border-color: var(--color-danger) !important;
			animation: shake 0.2s ease-in-out 0s 2;

			@keyframes shake {
				0% {
					margin-left: 0;
				}
				25% {
					margin-left: 0.5rem;
				}
				75% {
					margin-left: -0.5rem;
				}
				100% {
					margin-left: 0;
				}
			}

			input {
				color: var(--color-danger);
			}

			.append {
				color: var(--color-danger);
			}
		}

		&:not(:has(:disabled)):focus-within {
			input {
				border-color: var(--color-danger-accent);
			}
		}

		input {
			height: 32px;
			width: 100%;
			text-align: right;
			font-size: 32px;
			font-weight: var(--font-weight-heavy);
			font-family: var(--font-family-monospace);
			color: var(--color-primary);
		}

		.append {
			margin-bottom: 3px;

			.icon-loading {
				color: var(--color-primary);
			}
		}
	}

	.label {
		margin-left: auto;
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-light);
		font-style: italic;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	&:has(input:read-only),
	&:has(input:disabled) {
		opacity: .5;
	}
}
</style>
