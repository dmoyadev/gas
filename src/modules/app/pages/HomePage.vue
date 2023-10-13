<script setup lang="ts">
import { useAuthentication } from '@/modules/auth/composables/useAuthentication.ts';

const { user, logout } = useAuthentication();
</script>

<template>
	<div>
		Home!
		<br>
		{{ user }}
		<br>
		<button @click="logout()">
			Logout
		</button>
	</div>
</template>

<style scoped>

</style>