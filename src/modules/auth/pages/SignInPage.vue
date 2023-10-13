<script setup lang="ts">
import { useAuthentication } from '@/modules/auth/composables/useAuthentication.ts';
import { computed, ref, watch } from 'vue';
import router from '@/router.ts';
import { useRoute } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonColor, ButtonForm, ButtonMode } from '@/components/button/types.ts';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import { InputForm, InputType } from '@/components/input/types.ts';
import { IconSize } from '@/components/icon/types.ts';

const { signInWithMagicLink, signInWithPassword } = useAuthentication();

const email = ref<string>('');
const password = ref<string>('');

// Manage the error state of the form
const triedSubmit = ref<boolean>(false);
watch(email, () => triedSubmit.value = false);
const isEmailBadlyFormatted = ref(false);
const isEmailValid = computed<boolean>(() => {
	return !triedSubmit.value
		|| (triedSubmit.value
			&& !!email.value
			&& /.+@.+\..+/.test(email.value)
			&& !isEmailBadlyFormatted.value);
});
watch(password, (value) => {
	if(!value) {
		errorLogin.value = false;
	}
});
const magicLinkFailed = ref<boolean>(false);
const errorLogin = ref<boolean>(false);

const isMagicLinkSent = ref<boolean>(false);
const isMagicLinkReSent = ref<boolean>(false);
const loadingLogin = ref<boolean>(false);
const route = useRoute();
async function doSignIn() {
	errorLogin.value = false;
	isEmailBadlyFormatted.value = false;
	loadingLogin.value = true;
	triedSubmit.value = true;
	
	if(isMagicLinkSent.value) {
		isMagicLinkReSent.value = true;
	}
	
	if(!isEmailValid.value) {
		loadingLogin.value = false;
		return;
	}
	
	if(!magicLinkFailed.value) {
		signInWithMagicLink(email.value)
			.then(() => {
				isMagicLinkSent.value = true;
			})
			.catch(async (error) => {
				if(error.code === 'auth/invalid-email') {
					isEmailBadlyFormatted.value = true;
					return;
				}
				magicLinkFailed.value = true;
			})
			.finally(() => loadingLogin.value = false);
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
		.catch(() => errorLogin.value = true)
		.finally(() => loadingLogin.value = false);
}
</script>

<template>
	<AuthLayout>
		<template v-if="!isMagicLinkSent">
			<h1>Empieza a ahorrar gestionando tus vehículos</h1>
			<p>Controla repostajes y recargas, recuerda fechas importantes, y gestiona reparaciones.</p>
		
			<form @submit.prevent="doSignIn()">
				<section v-if="!magicLinkFailed">
					<BaseInput
						v-model="email"
						:input-type="InputType.EMAIL"
						:form="InputForm.NOTCHED_RIGHT"
						:has-error="!isEmailValid"
						:disabled="loadingLogin"
						class="notched"
					>
						Introduce tu email
						<template #error>
							Esto no es un email válido
						</template>
					</BaseInput>
				
					<BaseButton
						:type="isEmailValid ? 'submit' : 'reset'"
						:form="ButtonForm.CIRCLE"
						:color="isEmailValid ? ButtonColor.PRIMARY : ButtonColor.DANGER"
						:loading="loadingLogin"
					>
						<BaseIcon
							v-if="isEmailValid"
							icon="fa-solid fa-arrow-right"
						/>
						<BaseIcon
							v-else
							icon="fa-solid fa-xmark"
						/>
					</BaseButton>
				</section>
			
				<section v-else>
					<BaseInput
						v-model="password"
						:input-type="InputType.EMAIL"
						:form="InputForm.NOTCHED_RIGHT"
						:has-error="triedSubmit && errorLogin"
						class="notched"
						:disabled="loadingLogin"
					>
						Introduce tu contraseña
						<template #error>
							Los datos de acceso no son válidos
						</template>
					</BaseInput>
				
					<BaseButton
						type="submit"
						:form="ButtonForm.CIRCLE"
						:color="errorLogin ? ButtonColor.DANGER : ButtonColor.PRIMARY"
						:loading="loadingLogin"
					>
						<BaseIcon
							v-if="!errorLogin"
							icon="fa-solid fa-arrow-right"
						/>
						<BaseIcon
							v-else
							icon="fa-solid fa-xmark"
						/>
					</BaseButton>
				</section>
			</form>
		</template>
		
		<section
			v-else
			class="magic-link-sent"
		>
			<div class="icons">
				<BaseIcon
					icon="fa-solid fa-envelope-circle-check"
					:icon-size="IconSize.XXL"
					class="icon-success icon-sent"
				/>
				<Transition name="slide-in">
					<BaseIcon
						v-if="isMagicLinkReSent && !loadingLogin"
						icon="fa-solid fa-circle-check"
						:icon-size="IconSize.M"
						class="icon-success icon-resent"
					/>
				</Transition>
			</div>
			
			<div class="instructions">
				<p class="main">
					<template v-if="!isMagicLinkReSent && !loadingLogin">
						Se ha enviado un enlace a tu correo  para iniciar sesión automáticamente
					</template>
					<template v-else>
						Se ha vuelto a enviar el correo electrónico
					</template>
				</p>
				<p class="hint">
					Revisa tu carpeta de spam
				</p>
			</div>
			
			<div class="cta">
				<BaseButton
					:form="ButtonForm.CIRCLE"
					:color="ButtonColor.PRIMARY"
					:mode="ButtonMode.OUTLINE"
					:disabled="loadingLogin"
					@click="isMagicLinkSent = false"
				>
					<BaseIcon
						icon="fa-solid fa-arrow-left"
					/>
				</BaseButton>
				<BaseButton
					class="notched"
					:form="ButtonForm.NOTCHED_LEFT"
					:disabled="loadingLogin || isMagicLinkReSent"
					@click="doSignIn()"
				>
					<template v-if="!loadingLogin && !isMagicLinkReSent">
						Volver a enviar
					</template>
					<template v-if="!loadingLogin">
						Espera unos minutos para volver a enviar el correo
					</template>
					<template v-else>
						Enviando de nuevo...
					</template>
				</BaseButton>
			</div>
		</section>
		
		<small>
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
	
	section {
		display: flex;
		gap: 4px;
		
		.notched {
			flex: 1;
		}
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
		
		.notched {
			flex: 1;
		}
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