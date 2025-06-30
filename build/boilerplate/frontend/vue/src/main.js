import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { initSuperTokensWebJS } from "./config";
initSuperTokensWebJS();
createApp(App).use(router).mount("#app");
