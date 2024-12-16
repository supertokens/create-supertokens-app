<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as Session from "supertokens-web-js/recipe/session";
import { useRouter } from "vue-router";

// Define reactive variables
const session = ref(false);
const userId = ref("");
const router = useRouter();

// Get user information
const getUserInfo = async () => {
    session.value = await Session.doesSessionExist();
    if (session.value) {
        userId.value = await Session.getUserId();
    }
};

// Handle logout
const onLogout = async () => {
    await Session.signOut();
    window.location.reload();
};

const redirectToDashboard = () => {
    router.push("/dashboard");
};

// Fetch user info on component mount
onMounted(() => {
    getUserInfo();
});
</script>

<template>
    <main>
        <div class="home-container">
            <div className="logos">
                <img src="/ST.svg" alt="SuperTokens" />
                <span>x</span>
                <img src="/vue.svg" alt="React" />
            </div>

            <div class="main-container">
                <div v-if="session" class="inner-content">
                    <span>UserId:</span>
                    <h3>{{ userId }}</h3>

                    <button @click="onLogout">Sign Out</button>
                    <button @click="redirectToDashboard">Dashboard</button>
                </div>
                <div v-else class="inner-content">
                    <p>
                        Visit the
                        <a href="https://supertokens.com">SuperTokens tutorial</a> to learn how to build Auth under a
                        day.
                    </p>
                    <div className="buttons">
                        <a href="/auth" className="sessionButton"> Sign-up / Login </a>
                        <a href="/dashboard" className="sessionButton"> Dashboard </a>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
