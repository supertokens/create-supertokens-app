<script setup lang="ts">
import * as Session from "supertokens-web-js/recipe/session";

// Define reactive variables
const doesSessionExist = ref(false);

onMounted(async () => {
    doesSessionExist.value = await Session.doesSessionExist();
});
</script>

<template>
    <section class="logos">
        <img src="/ST.svg" alt="SuperTokens" />
        <span>x</span>
        <img src="/nuxt.svg" alt="nuxt" />
    </section>

    <section class="main-container">
        <div class="inner-content">
            <h1>
                <strong>SuperTokens</strong> x <strong>Vue</strong> <br />
                example project
            </h1>
            <div>
                <p v-if="doesSessionExist">
                    You're signed in already, <br />
                    check out the Dashboard! 👇
                </p>
                <p v-else>Sign-in to continue</p>
            </div>
            <nav class="buttons">
                <NuxtLink v-if="doesSessionExist" to="/dashboard" class="dashboard-button"> Dashboard </NuxtLink>
                <NuxtLink v-else to="/auth" class="dashboard-button"> Sign-up / Login </NuxtLink>
            </nav>
        </div>
    </section>
</template>
