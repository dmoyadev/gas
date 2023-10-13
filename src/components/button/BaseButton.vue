<script setup lang="ts">
import { ButtonColor, ButtonMode, ButtonForm } from '@/components/button/types';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { ComponentPublicInstance, ref } from 'vue';

const props = withDefaults(
	defineProps<{
		/**
		 * The mode of the button
		 */
		mode?: ButtonMode;
		/**
		 * The color to use for the button
		 */
		color?: ButtonColor;
		/**
		 * The form of the button
		 */
		form?: ButtonForm;
		/**
		 * Indicates the route to which the button should redirect when clicked
		 */
		to?: string;
		/**
		 * Indicates the URL to which the button should redirect when clicked
		 */
		href?: string;
		/**
		 * Indicates if the button is loading
		 */
		loading?: boolean
	}>(),
	{
		mode: ButtonMode.SOLID,
		color: ButtonColor.PRIMARY,
		form: ButtonForm.BLOCK,
		to: undefined,
		href: undefined,
	},
);

/* Ripple effect */
// This effect needs the button to have a position property set to relative or absolute so that the ripple element
// can be positioned absolutely, as well as hiding the overflow of the button.
const element = ref<HTMLButtonElement | HTMLAnchorElement | ComponentPublicInstance | null>(null);
const isRouterLink = (element: any): element is ComponentPublicInstance  => Boolean(props.to) && element.$el?.tagName === 'A';
function createRippleEffect(event: MouseEvent) {
	if(!element.value) { return; }
	
	const button = isRouterLink(element.value) ? element.value.$el : element.value;
	if(!button) { return; }
	
	const circle = document.createElement('span');
	const diameter = Math.max(button.clientWidth, button.clientHeight);
	const radius = diameter / 2;
	
	circle.style.width = circle.style.height = `${diameter}px`;
	const buttonPosition = button.getBoundingClientRect();
	circle.style.left = `${event.clientX - buttonPosition.left - radius}px`;
	circle.style.top = `${event.clientY - buttonPosition.top - radius}px`;
	circle.classList.add('ripple');
	
	const ripple = button.getElementsByClassName('ripple')[0];
	
	if (ripple) {
		ripple.remove();
	}
	
	button.appendChild(circle);
}
</script>

<template>
	<component
		:is="href ? 'a' : (to ? 'router-link' : 'button')"
		ref="element"
		:disabled="!!loading"
		:class="{
			[`button-mode-${mode}`]: true,
			[`button-color-${color}`]: true,
			[`button-form-${form}`]: true,
			'button-disabled': loading,
		}"
		@click="createRippleEffect($event)"
	>
		<!-- @slot Content of the button -->
		<slot v-if="!loading" />
		
		<!-- @slot Content of a loading button -->
		<slot
			v-else
			name="loading"
		>
			<BaseIcon
				icon="fa-solid fa-gear"
				spin-pulse
				spin-reverse
			/>
		</slot>
	</component>
</template>

<style scoped lang="scss">
button,
a,
router-link {
	height: 42px;
	min-width: 42px;
	padding: 12px;
	font-size: var(--font-size-body);
	line-height: var(--font-size-body);
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	font-weight: var(--font-heavy);
	position: relative;
	overflow: hidden;
	
	&.button-color {
		&-primary {
			background: var(--color-primary);
			color: var(--color-primary-accent);
			border-color: var(--color-primary);
		}
		
		&-grayscale {
			background: var(--color-gray-0);
			color: var(--color-gray-10);
			border-color: var(--color-gray-0);
		}
		
		&-danger {
			background: var(--color-danger);
			color: var(--color-danger-accent);
			border-color: var(--color-danger);
		}
	}
	
	&.button-mode {
		&-outline {
			border: 1px solid;
			background: none;
			
			&.button-color {
				&-primary {
					color: var(--color-primary);
					
					&:before {
						border-color: var(--color-primary);
					}
				}
				
				&-grayscale {
					color: var(--color-gray-0);
					
					&:before {
						border-color: var(--color-gray-0);
					}
				}
				
				&-danger {
					color: var(--color-danger);
					
					&:before {
						border-color: var(--color-danger);
					}
				}
			}
			
			&.button-form {
				&-notched-left,
				&-notched-right {
					&:before {
						border: 1px solid
					}
				}
				
				&-notched-left {
					border-left: none;
				}
				
				&-notched-right {
					border-right: none;
				}
			}
		}
		
		&-clear {
			background: transparent;
			
			&:before {
				display: none;
			}
			
			&.button-color {
				&-primary {
					color: var(--color-primary);
				}
				
				&-grayscale {
					color: var(--color-gray-0);
				}
				
				&-danger {
					color: var(--color-danger);
				}
			}
		}
	}
	
	&.button-form {
		&-block {
			width: 100%;
			border-radius: 4px;
		}
		
		&-inline {
			display: inline-flex;
			border-radius: 4px;
		}
		
		&-circle {
			display: inline-flex;
			border-radius: 100%;
		}
		
		&-notched-left,
		&-notched-right {
			position: relative;
			overflow: hidden;
			display: inline-flex;
			
			&:before {
				content: '';
				position: absolute;
				background: var(--color-secondary);
				top: 50%;
				transform: translateY(-50%);
				width: 60px;
				height: 60px;
				border-radius: 100%;
			}
		}
		
		&-notched-left {
			border-radius: 0 4px 4px 0;
			padding-left: 22px;
			
			&:before {
				left: -50px;
			}
		}
		
		&-notched-right {
			border-radius: 4px 0 0 4px;
			padding-right: 22px;
			
			&:before {
				right: -50px;
			}
		}
	}
	
	&.button-loading,
	&:disabled {
		opacity: .5;
	}
}
</style>

<style>
.ripple {
	position: absolute;
	border-radius: 50%;
	transform: scale(0);
	animation: ripple 600ms linear;
	background-color: rgba(255, 255, 255, .3);
}

@keyframes ripple {
	to {
		transform: scale(4);
		opacity: 0;
	}
}
</style>
