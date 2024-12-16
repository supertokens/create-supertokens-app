import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthComponent } from "./auth/auth.component";

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
    },
    {
        path: "dashboard",
        component: DashboardComponent,
    },
    {
        path: "auth",
        component: AuthComponent,
    },
    {
        path: "**",
        redirectTo: "",
    },
];
