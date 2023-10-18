<script setup lang="ts">
import { useAuthentication } from '@/modules/auth/composables/useAuthentication.ts';
import { computed, ref, watch } from 'vue';
import router from '@/router.ts';
import { useRoute } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonColor, ButtonForm } from '@/components/button/types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import { InputForm, InputType } from '@/components/input/types.ts';
import * as pkg from '@/../package.json';

const { signInWithPassword } = useAuthentication();

const email = ref<string>('');
const password = ref<string>('');

// Manage the error state of the form
const triedSubmit = ref<boolean>(false);
watch(email, () => triedSubmit.value = false);
const isEmailValid = computed<boolean>(() => {
	return !triedSubmit.value
		|| (triedSubmit.value
			&& !!email.value
			&& /.+@.+\..+/.test(email.value));
});
watch(password, (value) => {
	if(!value) {
		errorLogin.value = false;
	}
});

const isEmailSet = ref<boolean>(false);

const loadingLogin = ref<boolean>(false);
const errorLogin = ref<boolean>(false);
const route = useRoute();
async function doSignIn() {
	errorLogin.value = false;
	loadingLogin.value = true;
	triedSubmit.value = true;
	
	if(!isEmailValid.value) {
		loadingLogin.value = false;
		return;
	}
	
	if(!password.value) {
		isEmailSet.value = true;
		loadingLogin.value = false;
		return;
	}
	
	signInWithPassword(email.value, password.value)
		.then(async () => {
			// If there is a redirect query param, redirect to it
			if(route.query?.redirect) {
				await router.push(route.query.redirect as string);
				return;
			}
			
			await router.push('/');
		})
		.catch(() => errorLogin.value = true)
		.finally(() => loadingLogin.value = false);
}
</script>

<template>
	<AuthLayout>
		<h1>Empieza a ahorrar gestionando tus vehículos</h1>
		<p>Controla repostajes y recargas, recuerda fechas importantes, y gestiona reparaciones.</p>
		
		<form @submit.prevent="doSignIn()">
			<BaseInput
				v-model="email"
				:input-type="InputType.EMAIL"
				:has-error="!isEmailValid || (triedSubmit && errorLogin)"
				:disabled="loadingLogin"
				autocomplete="username"
				is-required
			>
				Introduce tu email
				<template
					v-if="!isEmailValid"
					#error
				>
					Esto no es un email válido
				</template>
			</BaseInput>
			
			<section>
				<BaseInput
					v-model="password"
					:input-type="InputType.PASSWORD"
					:form="InputForm.NOTCHED_RIGHT"
					:has-error="triedSubmit && errorLogin"
					:disabled="loadingLogin"
					autocomplete="current-password"
					is-required
					autofocus
				>
					Introduce tu contraseña
					<template #error>
						Los datos de acceso no son válidos
					</template>
				</BaseInput>
				
				<BaseButton
					type="submit"
					:form="ButtonForm.CIRCLE"
					:color="(triedSubmit && errorLogin) ? ButtonColor.DANGER : ButtonColor.PRIMARY"
					:loading="loadingLogin"
					:disabled="!isEmailValid || loadingLogin"
				>
					<BaseIcon
						v-if="(triedSubmit && errorLogin)"
						icon="fa-solid fa-xmark"
					/>
					<BaseIcon
						v-else
						icon="fa-solid fa-arrow-right"
					/>
				</BaseButton>
			</section>
		</form>
		
		<small>
			v.{{ pkg.version }}
			<br>
			Continuando, indicas que aceptas nuestros
			<a href="#">Términos y condiciones</a> y la <a href="#">Política de privacidad</a>
		</small>
	</AuthLayout>
</template>

<style lang="scss" scoped>
h1 {
	font-weight: bold;
	font-size: 18px;
	max-width: 265px;
}

p {
	font-size: var(--font-size-small);
	font-weight: 300;
	color: var(--color-primary);
}

form {
	margin-top: auto;
	margin-bottom: auto;
	display: flex;
	flex-direction: column;
	gap: 34px;
	
	section {
		display: flex;
		gap: 4px;
	}
}

.magic-link-sent {
	margin-top: auto;
	margin-bottom: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	position: relative;
	
	.icon-sent {
		text-shadow: 0 0 2px var(--color-secondary);
	}
	
	.icon-resent {
		position: absolute;
		top: 8px;
		left: calc(50% + 18px);
	}
	
	.instructions {
		.main {
			font-size: var(--font-size-body);
			font-weight: var(--font-weight-heavy);
			text-align: center;
			color: var(--color-secondary-accent);
		}
		
		.hint {
			text-align: center;
			font-size: var(--font-size-small);
		}
	}
	
	.cta {
		margin-top: 28px;
		width: 100%;
		display: flex;
		gap: 4px;
	}
}

small {
	margin-top: auto;
	align-self: center;
	display: block;
	font-size: var(--font-size-legal);
	color: var(--color-primary);
	text-align: center;
	max-width: 230px;
	
	a {
		color: var(--color-secondary-accent);
		font-size: var(--font-size-legal);
		text-decoration: underline;
	}
}
</style>

<style>
.slide-in-enter-active {
	animation: slide-in 1.5s ease-in-out;
}

@keyframes slide-in {
	from {
		transform: rotate(720deg);
		left: 120%;
	}
}
</style>