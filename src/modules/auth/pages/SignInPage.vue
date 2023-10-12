<script setup lang="ts">
import { useAuthentication } from "@/modules/auth/composables/useAuthentication.ts";
import { ref } from "vue";
import router from "@/router.ts";
import { useRoute } from "vue-router";

const { user, signInWithMagicLink, signInWithPassword } = useAuthentication();

const email = ref<string>('');
const magicLinkFailed = ref<boolean>(false);
const password = ref<string>('');

const showError = ref<boolean>(false);

const route = useRoute();
function doSignIn() {
	showError.value = false;
	debugger;
	if(!magicLinkFailed.value) {
		signInWithMagicLink(email.value)
			.then(async () => {
				let url = `/login${route.query?.redirect ? ('?redirect=' + route.query.redirect) : ''}`;
				await router.push(url);
			})
			.catch(() => magicLinkFailed.value = true)
		return;
	}
	
	signInWithPassword(email.value, password.value)
		.then(async () => {
			if(route.query?.redirect) {
				await router.push(route.query.redirect as string);
				return;
			}
			
			await router.push('/');
		})
		.catch(() => showError.value = true);
}
</script>

<template>
	<div>
		signin
		{{ user }}
		<form @submit.prevent="doSignIn()">
			email: <input v-if="!magicLinkFailed" type="text" v-model="email" />
			<br>
			pass: <input v-if="magicLinkFailed" type="password" v-model="password" />
			<br>
			{{ showError ? 'error' : '' }}
			<button>Submit</button>
		</form>
		<router-link to="/login">
			login
		</router-link>
	</div>
</template>

<style scoped>

</style>