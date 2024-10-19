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

  async function callApi() {
    try {
        const response = await fetch("/sessioninfo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        alert(JSON.stringify(data, null, 2));
      } catch (error) {
        alert(`Failed to fetch session info: ${error}`);
      }
  }
</script>

<main>
	<div class="body">
		<h1>Hello</h1>

		{#if session}
			<div>
				<span>UserId:</span>
				<h3>{userId}</h3>

        <div class="session__btn">
            <button class="btn" on:click={callApi}>Call API</button>
            <button class="btn" on:click={onLogout}>Sign Out</button>
        </div>
			</div>
		{:else}
			<div>
				<p>
					Visit the
					<a href="https://supertokens.com">SuperTokens tutorial</a> to learn how to build Auth under
					a day.
				</p>
        <button class="btn" on:click={redirectToLogin}>Sign in</button>
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
    color: #ff7547;
}

h1 {
    color: #ff7547;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
}

.btn {
    border: none;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    color: #fff;
    transition: all 0.2s ease-in;
    background-color: #ff7547;
    font-size: large;
    margin-left: 20px;
}
.btn:hover {
    box-shadow: 0 8px 25px -8px #ffb399;
}
.session__btn {
    display: flex;
    justify-content: space-around;
}
</style>
