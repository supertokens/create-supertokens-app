<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as Session from "supertokens-web-js/recipe/session";
import BaseLayout from "../layouts/BaseLayout.vue";

// Define reactive variables
const session = ref(false);
const userId = ref("");

// Get user information
const getUserInfo = async () => {
    session.value = await Session.doesSessionExist();
    if (session.value) {
        userId.value = await Session.getUserId();
    }
};

// Fetch user info on component mount
onMounted(() => {
    getUserInfo();
});
</script>

<template>
    <BaseLayout>
        <div class="fill" id="home-container">
            <div class="logos">
                <img src="/ST.svg" alt="SuperTokens" />
                <span>x</span>
                <img src="/vue.svg" alt="React" />
            </div>

            <div class="main-container">
                <div class="inner-content">
                    <p>
                        <strong>SuperTokens</strong> x <strong>Vue</strong> <br />
                        example project
                    </p>
                    <div class="buttons">
                        <a href="/auth" class="sessionButton"> Sign-up / Login </a>
                        <a href="/dashboard" class="sessionButton"> Dashboard </a>
                    </div>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>
