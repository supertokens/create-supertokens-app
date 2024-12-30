<script setup lang="ts">
const apiPort = import.meta.env.VITE_APP_API_PORT || 3001;
const apiUrl = import.meta.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;

async function callAPIClicked() {
    try {
        const response = await fetch(`${apiUrl}/sessioninfo`);
        const data = await response.json();
        window.alert("Session Information:\n" + JSON.stringify(data, null, 2));
    } catch (error) {
        window.alert("Failed to fetch session information:\n" + error);
    }
}
</script>

<template>
    <div @click="callAPIClicked" class="sessionButton">Call API</div>
</template>
