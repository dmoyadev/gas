<script setup lang="ts">
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { computed } from 'vue';
import { isElectricVehicle, VehicleFuelType } from '@/modules/app/models/Vehicle.ts';
import HomeEmptyPartial from '@/modules/app/partials/HomeEmptyPartial.vue';
import { IconSize } from '@/components/icon/types.ts';
import RecentRefills from '@/modules/app/components/RecentRefills.vue';
import HomeHeader from '@/modules/app/components/HomeHeader.vue';
import { useSelectedVehicle } from '@/modules/vehicles/composables/useSelectedVehicle.ts';

const {
	vehicle,
	loading,
	error,
	emptyLoading,
} = useSelectedVehicle();

const fuelText = computed<string>(() => {
	if(!vehicle.value) { return ''; }
	
	switch(vehicle.value?.fuelType) {
		case VehicleFuelType.GASOLINE:
			return 'Repostaje';
		case VehicleFuelType.DIESEL:
			return 'Repostaje';
		case VehicleFuelType.ELECTRIC:
			return 'Recarga';
		case VehicleFuelType.HYBRID:
			return 'Suministro';
		default:
			return 'Repostaje';
	}
});
</script>

<template>
	<!-- ⏳ Loading state -->
	<template v-if="loading || emptyLoading">
		<HomeHeader :class="{ 'broken': emptyLoading }" />
		
		<main :class="{ 'broken': emptyLoading }">
			<section class="car-details">
				<div class="car-details--info">
					<div class="car-details--info--card">
						<div class="car-details--info--card--title">
							<BaseIcon icon="fa-solid fa-address-card" />
							<span>Matrícula</span>
						</div>
						<span class="skeleton-item" />
					</div>
					
					<div class="car-details--info--card">
						<div class="car-details--info--card--title">
							<BaseIcon icon="fa-solid fa-gauge" />
							<span>Kilómetros</span>
						</div>
						<span class="skeleton-item" />
					</div>
				</div>
				
				<img
					src="/images/car-silhouette.svg"
					alt="Silueta de coche"
					class="car-details--image"
				>
			</section>
			
			<section class="car-actions">
				<span class="skeleton-item skeleton-item--big-square" />
				<span class="skeleton-item skeleton-item--big-square" />
				<span class="skeleton-item skeleton-item--big-square" />
			</section>
			
			<RecentRefills />
		</main>
	</template>
	
	<!-- 🚨 Error state -->
	<template v-else-if="error">
		Error
	</template>
	
	<!-- 📃 Empty state -->
	<HomeEmptyPartial v-else-if="!vehicle" />
	
	<!-- ✅ Success state -->
	<template v-else>
		<HomeHeader :vehicle="vehicle" />
		
		<main>
			<section class="car-details">
				<div class="car-details--info">
					<div class="car-details--info--card">
						<div class="car-details--info--card--title">
							<BaseIcon icon="fa-solid fa-address-card" />
							<span>Matrícula</span>
						</div>
						<span class="car-details--info--card--value">{{ vehicle?.plate }}</span>
					</div>
					
					<div class="car-details--info--card">
						<div class="car-details--info--card--title">
							<BaseIcon icon="fa-solid fa-gauge" />
							<span>Kilometraje</span>
						</div>
						<span class="car-details--info--card--value">{{ vehicle?.odometer?.toLocaleString() }}</span>
					</div>
				</div>
				
				<img
					:src="`/images/${vehicle?.vehicleType || 'car'}-silhouette.svg`"
					alt="Silueta del vehículo"
					class="car-details--image"
				>
			</section>
			
			<section class="car-actions">
				<router-link 
					class="car-actions--action"
					:to="`/vehicles/${vehicle?.id}/refill`"
				>
					<BaseIcon
						v-if="!isElectricVehicle(vehicle)"
						icon="fa-solid fa-gas-pump"
						:icon-size="IconSize.XL"
					/>
					<BaseIcon
						v-else-if="vehicle?.fuelType === VehicleFuelType.ELECTRIC"
						icon="fa-solid fa-charging-station"
						:icon-size="IconSize.XL"
					/>
					<div v-else>
						<BaseIcon
							class="icon"
							icon="fa-solid fa-gas-pump"
							:icon-size="IconSize.M"
						/>
						<BaseIcon
							class="icon"
							icon="fa-solid fa-charging-station"
							:icon-size="IconSize.M"
						/>
					</div>
					
					{{ fuelText }}
				</router-link>
				
				<router-link
					class="car-actions--action"
					:to="`/vehicles/${vehicle?.id}/garage`"
				>
					<BaseIcon
						class="icon"
						icon="fa-solid fa-wrench"
						:icon-size="IconSize.XL"
					/>
					
					Taller
				</router-link>
				
				<router-link
					:to="`/vehicles/${vehicle?.id}/expense`"
					class="car-actions--action"
				>
					<BaseIcon
						class="icon"
						icon="fa-solid fa-file-invoice-dollar"
						:icon-size="IconSize.XL"
					/>
					
					Otros
				</router-link>
			</section>
			
			<RecentRefills :vehicle="vehicle" />
		</main>
	</template>
</template>

<style lang="scss" scoped>
.broken {
	animation: break .5s ease-in-out forwards, fall .5s ease-in-out;
	
	@keyframes break {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
			opacity: 0;
		}
	}
	
	@keyframes fall {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(200px);
		}
	}
}

main {
	min-height: 100svh;
	padding: 0 16px calc(var(--tab-height) + 16px);
	display: flex;
	flex-direction: column;
	gap: 24px;
	
	h2 {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	
	.car-details {
		display: flex;
		gap: 32px;
		
		&--info {
			margin: auto 0;
			display: flex;
			flex-direction: column;
			gap: 24px;
			flex: 3;
			
			&--card {
				display: flex;
				flex-direction: column;
				gap: 4px;
				
				&--title {
					display: flex;
					align-items: center;
					gap: 4px;
					
					span {
						font-size: var(--font-size-small);
						font-weight: var(--font-light);
					}
				}
				
				&--value {
					font-size: var(--font-size-big);
					font-weight: var(--font-heavy);
				}
			}
		}
		
		&--image {
			flex: 1;
			width: 100%;
			opacity: .6;
			transform: scaleX(-1);
		}
	}
	
	.car-actions {
		display: flex;
		gap: 8px;
		
		router-link,
		a {
			flex: 1;
			height: 75px;
			background: var(--color-primary);
			color: var(--color-primary-accent);
			box-shadow: 0 0 12px 1px rgba(255,241,128,0.37);
			border-radius: 4px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 8px;
			font-size: var(--font-size-small);
			font-weight: var(--font-heavy);
			
			div {
				display: flex;
				height: 32px;
				
				.icon:last-child {
					align-self: flex-end;
				}
			}
		}
	}
}
</style>