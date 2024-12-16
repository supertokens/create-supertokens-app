<script setup lang="ts">
async function handleCallAPI() {
    const { data, error } = await useFetch("/sessioninfo", {
        method: "GET",
        onResponse({ request, response, options }) {
            alert(JSON.stringify(response._data, null, 2));
        },
    });
}
</script>

<template>
    <div @click="handleCallAPI" class="sessionButton">Call API</div>
</template>

<style scoped></style>
