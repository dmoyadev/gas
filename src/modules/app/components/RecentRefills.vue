<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDB } from '@/modules/app/composables/useDB.ts';
import { Vehicle } from '@/modules/app/models/Vehicle.ts';
import { where } from 'firebase/firestore';

const props = defineProps<{
	vehicle?: Vehicle
}>();

const { 
	getBy, 
	loading, 
} = useDB('refill');
const refills = ref<unknown[]>();
loading.value = true;

const emptyLoading = ref(false);
watch(() => props.vehicle, (value) => {
	if(!value) { return; }
	
	loading.value = false;
	getBy<unknown[]>(where('vehicle_id', '==', value.id))
		.then((data) => {
			if(data.length ) {
				refills.value = data;
			} else {
				emptyLoading.value = true;
				setTimeout(() => {
					emptyLoading.value = false;
					refills.value = [];
				}, 300);
			}
		});
}, { immediate: true });
</script>

<template>
	<!-- ⏳ Loading state -->
	<section v-if="loading">
		<span
			class="skeleton-item"
			style="width: 25ch;"
		/>
		
		<ul>
			<li
				v-for="n in 5"
				:key="n"
			>
				<span class="skeleton-item skeleton-item--icon" />
				
				<div class="info">
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
				
				<div class="price">
					<span
						class="title"
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
	
	<section v-else />
</template>

<style lang="scss" scoped>
section {
	display: flex;
	flex-direction: column;
	gap: 16px;
	
	ul {
		display: flex;
		flex-direction: column;
		gap: 16px;
		
		li {
			display: flex;
			align-items: center;
			gap: 16px;
			
			.info {
				display: flex;
				flex-direction: column;
				gap: 4px;
				flex: 1;
			}
			
			.price {
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
</style>