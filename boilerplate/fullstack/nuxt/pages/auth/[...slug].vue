<script setup lang="ts">
import { initSuperTokensUI } from "../../config/frontend";

onMounted(() => {
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

    loadScript("https://cdn.jsdelivr.net/gh/supertokens/prebuiltui@v0.47.1/build/static/js/main.ba50d5ee.js");
});
</script>

<template>
    <div id="supertokensui" />
</template>
