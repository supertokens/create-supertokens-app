import { onMount } from "solid-js";
import { initSuperTokensUI } from "./config";
const loadScript = (src) => {
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
        loadScript("${jsdeliveryprebuiltuiurl}");
    });
    return <div id="supertokensui" />;
};
