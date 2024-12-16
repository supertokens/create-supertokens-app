<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { initSuperTokensUI } from "../config";

// Load the SuperTokens script dynamically
const loadScript = (src: string) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.id = "supertokens-script";
    script.onload = () => {
        initSuperTokensUI();
    };
    document.body.appendChild(script);
};

// Load script when component is mounted
onMounted(() => {
    loadScript("${jsdeliveryprebuiltuiurl}");
});

// remove script when component is unmounted
onUnmounted(() => {
    const script = document.getElementById("supertokens-script");
    if (script) {
        script.remove();
    }
});
</script>

<template>
    <div id="supertokensui" />
</template>
