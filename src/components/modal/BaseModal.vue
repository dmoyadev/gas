<script setup lang="ts">
import { watch } from 'vue';
import { ButtonColor, ButtonForm, ButtonMode } from '@/components/button/types';
import BaseButton from '@/components/button/BaseButton.vue';

const props = defineProps<{
	/**
	 * Whether the modal should be shown or not. It is needed over the
	 * `v-if` directive for the transitions to work properly
	 */
	show?: boolean;
	/**
	 * The title of the modal
	 */
	title?: string;
}>();

defineEmits<{
	/**
	 * Emitted when the modal is closed
	 */
	close: [];
}>();

const app = document.querySelector('#app');
watch(() => props.show, () => {
	if (props.show) {
		app?.classList.add('modal-opened');
	} else {
		app?.classList.remove('modal-opened');
	}
});
</script>

<template>
	<Teleport to="body">
		<Transition name="slide-fade">
			<div
				v-if="show"
				class="modal"
			>
				<!-- @slot The content of the modal -->
				<slot name="dialog">
					<dialog
						open
						v-bind="$attrs"
					>
						<header>
							<div class="placeholder" />

							<!-- @slot The title of the modal -->
							<span
								v-if="title"
								class="title"
							>
								{{ title }}
							</span>

							<!-- Close button -->
							<BaseButton
								class="btn-close"
								:mode="ButtonMode.CLEAR"
								:form="ButtonForm.INLINE"
								:color="ButtonColor.PRIMARY"
								@click="$emit('close')"
							>
								Cerrar
							</BaseButton>
						</header>

						<!-- @slot The main content of the modal -->
						<slot />
					</dialog>
				</slot>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
.modal {
	position: absolute;
	top: 24px;
	width: 100%;
	min-height: calc(100% - 24px);
	z-index: 1000;
	background: var(--color-secondary);
	border-radius: 8px 8px 0 0;

	dialog {
		header {
			position: sticky;
			top: 0;
			z-index: 100;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-radius: 8px 8px 0 0;
			background: var(--color-secondary-dark);

			.placeholder {
				width: 72px;
			}

			.title {
				flex: 1;
				text-align: center;
				color: var(--color-secondary-accent);
			}

			.btn-close {
				margin-left: auto;
			}
		}
	}
}
</style>

<style lang="scss">
#app {
	transition: transform 0.2s ease;

	&.modal-opened {
		border-radius: 8px;
		position: fixed;
		overflow: hidden;
		transform: scale(.95, .97);
	}
}

.slide-fade-enter-active {
	transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
	transition: all 0.2s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	transform: translateY(100%);
}
</style>
