import { onMount } from "solid-js";
import { initSuperTokensUI } from "./config";

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

export const Auth = () => {
    onMount(() => {
        loadScript("https://cdn.jsdelivr.net/gh/supertokens/prebuiltui@v0.48.0/build/static/js/main.81589a39.js");
    });

    return <div id="supertokensui" />;
};
