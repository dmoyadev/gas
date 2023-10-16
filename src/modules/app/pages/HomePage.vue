<script setup lang="ts">
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { ref } from 'vue';
import { useDB } from '@/modules/app/composables/useDB.ts';
import { useStickyObserver } from '@/modules/app/composables/useStickyObserver.ts';
import { Vehicle } from '@/modules/app/models/Vehicle.ts';
import { where } from 'firebase/firestore';
import BaseButton from '@/components/button/BaseButton.vue';

const $header = ref<HTMLElement>();
useStickyObserver($header);

const { getBy, loading, error } = useDB('vehicles');
const data = ref<Vehicle>();
getBy<Vehicle>(where('selected', '==', true))
	.then((vehicles) => {
		data.value = vehicles.length ? vehicles[0] : undefined;
	});
</script>

<template>
	<!-- ⏳ Loading state -->
	<template v-if="loading">
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
	
	<!-- 🚨 Error state -->
	<template v-else-if="error">
		Error
	</template>
	
	<!-- 📃 Empty state -->
	<template v-else-if="!data">
		<main class="empty-state">
			<img
				src="/assets/isotype.svg"
				alt="Logo"
				class="empty-state--image"
			>
			<p class="empty-state--title">
				Todavía no has añadido ningún vehículo a la aplicación...
				<span class="empty-state__highlight">¿Empezamos?</span>
			</p>
			
			<BaseButton
				class="empty-state--button"
				to="/vehicles/__new__"
			>
				Añadir vehículo
			</BaseButton>
		</main>
	</template>
	
	<!-- ✅ Success state -->
	<!-- TODO -->
	<template v-else>
		<header ref="$header">
			<div class="car-brand">
				<BaseIcon
					:icon="data.brand.icon"
					:color="data.brand.color"
				/>
				<span>{{ data.brand.name }}</span>
			</div>
			<span
				class="car-brand--model"
				:class="{ 'skeleton-item': loading }"
			>
				{{ data.model }}
			</span>
		</header>
		
		<main>
			<section class="car-details">
				<div class="car-details__info">
					<div class="car-details__info--card">
						<div class="car-details__info--card__title">
							<BaseIcon icon="fa-solid fa-address-card" />
							<span>Matrícula</span>
						</div>
						<span>{{ data.plate }}</span>
					</div>
					
					<div class="car-details__info--card">
						<div class="car-details__info--card__title">
							<BaseIcon icon="fa-solid fa-gauge" />
							<span>Kilómetros</span>
						</div>
						<span>{{ data.kilometers }}</span>
					</div>
				</div>
				
				<img
					:src="data.image"
					:alt="`Imagen de ${data.brand.name} ${data.model}`"
					class="car-details__image"
				>
			</section>
			
			<section class="car-actions">
				<BaseIcon
					icon="fa-solid fa-gas-pump"
					:color="data.brand.color"
				/>
				<BaseIcon
					icon="fa-solid fa-wrench"
					:color="data.brand.color"
				/>
				<BaseIcon
					icon="fa-solid fa-file-invoice-dollar"
					:color="data.brand.color"
				/>
			</section>
			
			<section class="car-recent-refuels">
				<h2 class="car-recent-refuels__title">
					Últimos repostajes
				</h2>
				
				<ul class="car-recent-refuels__list">
					<li
						v-for="refuel in data.refuels"
						:key="refuel.id"
						class="car-recent-refuels__list__item"
					/>
				</ul>
			</section>
		</main>
	</template>
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
	
	&.empty-state {
		height: 100svh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		
		.empty-state {
			&--title {
				font-size: var(--font-size-big);
				display: flex;
				flex-direction: column;
				gap: 4px;
				max-width: 304px;
			}
			
			&__highlight {
				font-size: var(--font-size-big);
				color: var(--color-primary);
			}
		}
	}
	
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