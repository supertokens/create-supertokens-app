<script setup lang="ts">
import * as Session from "supertokens-web-js/recipe/session";
import { initSuperTokensWebJS } from "../config/frontend";

// Reactive variables
const session = ref(false);
const userId = ref("");
const router = useRouter();

// Initialize SuperTokens and fetch user info
const getUserInfo = async () => {
    session.value = await Session.doesSessionExist();
    if (session.value) {
        userId.value = await Session.getUserId();
    }
};

const redirectToDashboard = () => {
    router.push("/dashboard");
};

onMounted(async () => {
    initSuperTokensWebJS();
    await getUserInfo();
});

// Methods
const callApi = async () => {
    const { data, error } = await useFetch("/sessioninfo", {
        method: "GET",
        onResponse({ request, response, options }) {
            alert(JSON.stringify(response._data, null, 2));
        },
    });
};

const onLogout = async () => {
    await Session.signOut();
    window.location.reload();
};
</script>

<template>
    <main>
        <div id="home-container" class="fill">
            <div class="logos">
                <img src="/ST.svg" alt="SuperTokens" />
                <span>x</span>
                <img src="/nuxt.svg" alt="nuxt" />
            </div>

            <div class="main-container">
                <div v-if="session" class="inner-content">
                    <span>UserId:</span>
                    <h3>{{ userId }}</h3>

                    <div class="buttons">
                        <button @click="onLogout" class="sessionButton">Sign Out</button>
                        <button @click="redirectToDashboard" class="sessionButton">Dashboard</button>
                    </div>
                </div>
                <div v-else class="inner-content">
                    <p>
                        <strong>SuperTokens</strong> x <strong>Nuxt</strong> <br />
                        example project
                    </p>
                    <div class="buttons">
                        <NuxtLink href="/auth" class="sessionButton"> Sign-up / Login </NuxtLink>
                        <NuxtLink href="/dashboard" class="sessionButton"> Dashboard </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
