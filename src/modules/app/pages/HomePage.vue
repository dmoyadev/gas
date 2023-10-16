<script setup lang="ts">
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { onMounted, onUnmounted, ref } from 'vue';

// Adds a class to the header when it's stuck (sticky affects) to the top of the screen.
// More info: https://css-tricks.com/how-to-detect-when-a-sticky-element-gets-pinned/
const $header = ref<HTMLElement | null>(null);
let observer: IntersectionObserver;
onMounted(() => {
	observer = new IntersectionObserver(
		([e]) => e.target.classList.toggle('stuck', e.intersectionRatio < 1),
		{ threshold: [1] },
	);
	
	if ($header.value) {
		observer.observe($header.value);
	}
});

onUnmounted(() => {
	if ($header.value) {
		observer.unobserve($header.value);
	}
});
</script>

<template>
	<header ref="$header">
		<div class="car-brand">
			<span class="skeleton-item skeleton-item--icon" />
			<span
				class="skeleton-item"
				style="width: 15ch"
			/>
		</div>
		<span
			class="car-brand--model skeleton-item skeleton-item--title"
			style="width: 25ch;"
		/>
	</header>
	
	<main>
		<section class="car-details">
			<div class="car-details__info">
				<div class="car-details__info--card">
					<div class="car-details__info--card__title">
						<BaseIcon icon="fa-solid fa-address-card" />
						<span>Matrícula</span>
					</div>
					<span class="skeleton-item" />
				</div>
				
				<div class="car-details__info--card">
					<div class="car-details__info--card__title">
						<BaseIcon icon="fa-solid fa-gauge" />
						<span>Kilómetros</span>
					</div>
					<span class="skeleton-item" />
				</div>
			</div>
			
			<img
				src="/images/car-silhouette.svg"
				alt="Silueta de coche"
				class="car-details__image"
			>
		</section>
		
		<section class="car-actions">
			<span class="skeleton-item skeleton-item--big-square" />
			<span class="skeleton-item skeleton-item--big-square" />
			<span class="skeleton-item skeleton-item--big-square" />
		</section>
		
		<section class="car-recent-refuels">
			<span
				class="skeleton-item"
				style="width: 25ch;"
			/>
			
			<ul class="car-recent-refuels__list">
				<li
					v-for="n in 5"
					:key="n"
					class="car-recent-refuels__list__item"
				>
					<span class="skeleton-item skeleton-item--icon" />
					
					<div class="car-recent-refuels__list__item__info">
						<span
							class="skeleton-item skeleton-item--small"
							style="width: 8ch;"
						/>
						<span
							class="skeleton-item skeleton-item--small"
							style="width: 15ch;"
						/>
						<span
							class="skeleton-item skeleton-item--small"
							style="width: 12ch;"
						/>
					</div>
					
					<div class="car-recent-refuels__list__item__price">
						<span
							class="skeleton-item skeleton-item--title"
							style="width: 8ch;"
						/>
						<span
							class="skeleton-item skeleton-item--small"
							style="width: 15ch;"
						/>
					</div>
				</li>
			</ul>
		</section>
	</main>
</template>

<style lang="scss" scoped>
header {
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 4px;
	position: sticky;
	top: -1px; /* More info: https://css-tricks.com/how-to-detect-when-a-sticky-element-gets-pinned/ */
	width: 100%;
	
	.car-brand {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	
	&.stuck {
		z-index: 100;
		
		/* From https://css.glass */
		background: rgba(35, 67, 85, 0.6);
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		
		.car-brand--model {
			display: none;
		}
	}
}

main {
	padding: 0 16px calc(var(--tab-height) + 16px);
	display: flex;
	flex-direction: column;
	gap: 24px;
	
	.car-details {
		display: flex;
		gap: 32px;
		
		&__info {
			margin: auto 0;
			display: flex;
			flex-direction: column;
			gap: 24px;
			flex: 3;
			
			&--card {
				display: flex;
				flex-direction: column;
				gap: 4px;
				
				&__title {
					display: flex;
					align-items: center;
					gap: 4px;
					
					span {
						font-size: var(--font-size-small);
					}
				}
			}
		}
		
		&__image {
			flex: 1;
			width: 100%;
			opacity: .6;
			transform: scaleX(-1);
		}
	}
	
	.car-actions {
		display: flex;
		gap: 8px;
	}
	
	.car-recent-refuels {
		display: flex;
		flex-direction: column;
		gap: 16px;
		
		&__list {
			display: flex;
			flex-direction: column;
			gap: 16px;
			
			&__item {
				display: flex;
				align-items: center;
				gap: 16px;
				
				&__info {
					display: flex;
					flex-direction: column;
					gap: 4px;
					flex: 1;
				}
				
				&__price {
					height: 100%;
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					gap: 4px;
					margin-left: auto;
					flex-shrink: 0;
				}
			}
		}
	}
}
</style>