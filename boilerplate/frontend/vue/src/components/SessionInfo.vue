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

<style scoped>
.sessionButton {
    cursor: pointer;
    padding: 10px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
    user-select: none;
}

.sessionButton:hover {
    background-color: #e0e0e0;
}
</style>
