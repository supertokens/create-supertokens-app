<script lang="ts">
	import * as Session from 'supertokens-web-js/recipe/session';
	import { onMount } from 'svelte';
	import { initSuperTokensWebJS } from '../config/frontend';

	let session = false;
	let userId = '';

	async function getUserInfo() {
		session = await Session.doesSessionExist();
		if (session) {
			userId = await Session.getUserId();
		}
	}

	onMount(() => {
		initSuperTokensWebJS();
		getUserInfo();
	});

	function redirectToLogin() {
		window.location.href = '/auth';
	}

	async function onLogout() {
		await Session.signOut();
		window.location.reload();
	}
</script>

<main>
	<div class="body">
		<h1>Hello</h1>

		{#if session}
			<div>
				<span>UserId:</span>
				<h3>{userId}</h3>

				<button on:click={onLogout}>Sign Out</button>
			</div>
		{:else}
			<div>
				<p>
					Visit the
					<a href="https://supertokens.com">SuperTokens tutorial</a> to learn how to build Auth under
					a day.
				</p>
				<button on:click={redirectToLogin}>Sign in</button>
			</div>
		{/if}
	</div>
</main>

<style scoped>
	.body {
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.user {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: baseline;
		padding: 0.1rem;
	}

	span {
		margin-right: 0.3rem;
		font-size: large;
	}

	h3 {
		color: #ff3e00;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	button {
		cursor: pointer;
		background-color: #ffb399;
		border: none;
		color: rgb(82, 82, 82);
		padding: 0.75rem;
		margin: 2rem;
		transition: all 0.5s ease-in-out;
		border-radius: 2rem;
		font-size: large;
	}

	button:hover {
		transform: scale(1.1);
		background-color: #ff3e00;
		color: white;
	}
</style>
