<script setup lang="ts">
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonForm, ButtonMode } from '@/components/button/types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { IconSize } from '@/components/icon/types.ts';
import { onMounted, onUnmounted, ref } from 'vue';
// @ts-ignore
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const interval = ref();
onMounted(() => {
	confetti({ colors: [ '#FFF180', '#ffffff' ] });
	interval.value = window.setInterval(function(){
		confetti({
			origin: {
				x: Math.random() * 0.8 + 0.1,
				y: Math.random() * 0.8 + 0.1,
			},
			colors: [ '#FFF180', '#ffffff' ],
		});
	}, 1500);
});

onUnmounted(() => {
	confetti.reset();
	window.clearInterval(interval.value);
});
</script>

<template>
	<div class="content">
		<header>
			<BaseButton
				:mode="ButtonMode.CLEAR"
				:form="ButtonForm.CIRCLE"
				to="/"
			>
				<BaseIcon icon="fa-solid fa-arrow-left" />
			</BaseButton>
			
			<img
				src="/assets/logo.svg"
				alt="logo"
			>
			
			<!-- This is a placeholder for the logo to be centered -->
			<span />
		</header>
		
		<main>
			<BaseIcon
				class="icon"
				icon="fa-regular fa-circle-check"
				:icon-size="IconSize.XXL"
			/>
			
			<h1>¡Listo!</h1>
			
			<BaseButton to="/">
				Empezar a usar la app
			</BaseButton>
		</main>
	</div>
</template>

<style lang="scss" scoped>
.content {
	min-height: 100svh;
	display: flex;
	flex-direction: column;
}

header {
	padding: 32px 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	&:not(:has(span)) {
		justify-content: center;
	}
	
	img {
		width: 104px;
	}
	
	span {
		width: 42px;
	}
}

main {
	min-height: 60svh;
	padding: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 24px;
	text-align: center;
	
	.icon {
		color: var(--color-success);
	}
}
</style>