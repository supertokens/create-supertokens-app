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

    loadScript("${jsdeliveryprebuiltuiurl}");
});
</script>

<template>
    <div id="supertokensui" />
</template>
