<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as Session from "supertokens-web-js/recipe/session";
import BaseLayout from "../layouts/BaseLayout.vue";

// Define reactive variables
const doesSessionExist = ref(false);

onMounted(async () => {
    doesSessionExist.value = await Session.doesSessionExist();
});
</script>

<template>
    <BaseLayout>
        <section class="logos">
            <img src="/ST.svg" alt="SuperTokens" />
            <span>x</span>
            <img src="/vue.svg" alt="React" />
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

                    <nav class="buttons">
                        <router-link v-if="doesSessionExist" to="/dashboard" class="dashboard-button">
                            Dashboard
                        </router-link>
                        <router-link v-else to="/auth" class="dashboard-button"> Sign-up / Login </router-link>
                    </nav>
                </div>
            </div>
        </section>
    </BaseLayout>
</template>
