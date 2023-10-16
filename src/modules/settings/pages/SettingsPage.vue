<script setup lang="ts">
import BaseButton from '@/components/button/BaseButton.vue';
import { useAuthentication } from '@/modules/auth/composables/useAuthentication.ts';
import * as pkg from '@/../package.json';

const { user, logout } = useAuthentication();
</script>

<template>
	Settings!
	
	<pre>{{ user }}</pre>
	
	<BaseButton @click="logout()">
		Cerrar sesión
	</BaseButton>
	
	{{ pkg.version }}
</template>

<style lang="scss" scoped>

</style>