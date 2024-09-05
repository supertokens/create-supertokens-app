import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: "auth",
        loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
    },

    { path: "**", loadChildren: () => import("./home/home.module").then((m) => m.HomeModule) },
];
