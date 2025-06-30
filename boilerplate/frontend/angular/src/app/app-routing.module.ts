import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: "auth",
        loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
    },
    {
        path: "dashboard",
        loadChildren: () => import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
    },
    { path: "**", loadChildren: () => import("./home/home.module").then((m) => m.HomeModule) },
];
