<script lang="ts">
  import { goto } from '$app/navigation';
  import Session from 'supertokens-web-js/recipe/session';
  import { onMount } from 'svelte';
  import { initSuperTokensWebJS, getApiDomain } from '../../config/frontend';
  import { signOut, doesSessionExist } from "supertokens-web-js/recipe/session";
  
  let userId = '';

  onMount(async () => {
    initSuperTokensWebJS();
    
    const sessionExists = await doesSessionExist();
    if (!sessionExists) {
      goto('/');
    }

    fetchUserId();
  });


  async function fetchUserId() {
    const response = await fetch(getApiDomain() + "/api/sessioninfo");
    const data = await response.json();
    userId = data.userId;
  }

  async function logout() {
    await signOut();
    goto('/');
  }

  const fetchSessionInfo = async () => {
    const response = await fetch(getApiDomain() + "/api/sessioninfo");
    const data = await response.json();
    alert(JSON.stringify(data, null, 2));
  };

</script>

<div class="main-container">
  <div class="top-band success-title bold-500">
      <img src="/assets/images/celebrate-icon.svg" alt="Login successful" class="success-icon" />
      Login successful
  </div>
  <div class="inner-content">
      <div>Your userID is:</div>
      <div class="truncate" id="user-id">
         {userId}
      </div>
      <div class="buttons">
          <button class="dashboard-button" on:click={fetchSessionInfo}>
              Call API
          </button>
          <button class="dashboard-button" on:click={logout}>
              Logout
          </button>
      </div>
  </div>
</div>