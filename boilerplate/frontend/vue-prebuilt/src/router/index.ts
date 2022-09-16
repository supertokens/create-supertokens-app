import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

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
      component: () => import("../views/AuthView.vue"),
    },
  ],
});

export default router;
