import Vue from "vue";
import VueCompositionAPI, { createApp, h } from "@vue/composition-api";
import * as SuperTokens from "supertokens-web-js";

import App from "./App.vue";
import router from "./router";
import { SuperTokensWebJSConfig } from "./config";

SuperTokens.init(SuperTokensWebJSConfig);

Vue.use(VueCompositionAPI);

const app = createApp({
    router,
    render: () => h(App),
});

app.mount("#app");
