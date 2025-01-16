<script setup lang="ts">
import { initSuperTokensUI } from "~/config/frontend";

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

    loadScript("https://cdn.jsdelivr.net/gh/supertokens/prebuiltui@v0.48.0/build/static/js/main.81589a39.js");
});
</script>

<template>
    <div id="supertokensui" />
</template>
