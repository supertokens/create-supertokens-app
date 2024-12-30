<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { initSuperTokensUI } from "../config";
import BaseLayout from "../layouts/BaseLayout.vue";

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
    loadScript("https://cdn.jsdelivr.net/gh/supertokens/prebuiltui@v0.48.0/build/static/js/main.81589a39.js");
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
    <BaseLayout>
        <div id="home-container" class="fill">
            <div id="supertokensui" />
        </div>
    </BaseLayout>
</template>
