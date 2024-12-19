<script lang="ts">
	import Session from 'supertokens-web-js/recipe/session';
	import { onMount } from 'svelte';
	import { initSuperTokensWebJS } from '../config/frontend';

	let session = false;
	let userId = '';

	async function getUserInfo() {
		session = await Session.doesSessionExist();
		if (session) {
			return true;
		}

		return false;
	}

	onMount(() => {
		initSuperTokensWebJS();
		getUserInfo();
	});
</script>

<section class="logos">
	<img src="/ST.svg" alt="SuperTokens" />
	<span>x</span>
	<img src="/svelte_logo.png" alt="SvelteKit" />
</section>
<section class="main-container">
			<div class="inner-content">
					<h1>
							<strong>SuperTokens</strong> x <strong>SvelteKit</strong> <br /> example project
					</h1>
					<div>
				{#if session}
					<p class="session-exists">
						You're signed in already, <br /> check out the Dashboard! 👇
					</p>
				{:else}
					<p class="no-session">Sign-in to continue</p>
				{/if}
			</div>
			<nav class="buttons">
				{#if session}
				<a href="/dashboard" class="dashboard-button session-exists">
					Dashboard
				</a>
				{:else}
				<a href="/auth" class="dashboard-button no-session">
					Sign-up / Login
				</a>
				{/if}
			</nav>
		</div>
</section>

