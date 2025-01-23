import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AuthView from "../views/AuthView.vue";
import DashboardView from "../views/DashboardView.vue";
import Session from "supertokens-web-js/recipe/session";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/auth/:pathMatch(.*)*",
            name: "auth",
            component: AuthView,
        },
        {
            path: "/dashboard",
            name: "dashboard",
            component: DashboardView,
            beforeEnter: async (_, _1, next) => {
                if (!(await Session.doesSessionExist())) {
                    next("/auth");
                } else {
                    next();
                }
            },
        },
    ],
});

export default router;
