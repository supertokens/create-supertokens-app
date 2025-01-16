<script setup lang="ts">
import * as Session from "supertokens-web-js/recipe/session";
import CelebrateIcon from "../assets/images/celebrate-icon.svg";

const router = useRouter();
const userId = ref<string | null>(null);

async function callAPIClicked() {
    const { data, error } = await useFetch("/sessioninfo", {
        method: "GET",
        onResponse({ request, response, options }) {
            alert(JSON.stringify(response._data, null, 2));
        },
    });
}

async function logoutClicked() {
    await Session.signOut();
    router.push("/auth");
}

// Redirect to auth if user is not logged in
definePageMeta({
    middleware: [
        async function (to, from) {
            if (import.meta.client && !(await Session.doesSessionExist())) {
                return navigateTo("/auth");
            }
        },
    ],
});

onMounted(async () => {
    if (await Session.doesSessionExist()) {
        userId.value = await Session.getUserId();
    }
});
</script>

<template>
    <div class="main-container">
        <div class="top-band success-title bold-500">
            <img :src="CelebrateIcon" alt="Login successful" class="success-icon" /> Login successful
        </div>
        <div class="inner-content">
            <div>Your userID is:</div>
            <div class="truncate" id="user-id">
                {{ userId }}
            </div>
            <div class="buttons">
                <button @click="callAPIClicked" class="dashboard-button">Call API</button>
                <button @click="logoutClicked" class="dashboard-button">Logout</button>
            </div>
        </div>
    </div>
</template>
