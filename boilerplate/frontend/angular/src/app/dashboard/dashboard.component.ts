import { AfterViewInit, Component } from "@angular/core";

import * as Session from "supertokens-web-js/recipe/session";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements AfterViewInit {
    title = "Dashboard";

    public rootId = "rootId";
    public userId = "";
    public session = false;

    async ngAfterViewInit() {
        await this.getUserInfo();
        if (!this.session) {
            this.redirectToLogin();
        }
    }

    async getUserInfo() {
        this.session = await Session.doesSessionExist();
        if (this.session) {
            this.userId = await Session.getUserId();
        }
    }

    async onLogout() {
        await Session.signOut();
        window.location.reload();
    }

    async getSessionInfo() {
        const req = await fetch("http://localhost:3001/sessioninfo", {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const sessionInfo = await req.json();

        alert(JSON.stringify(sessionInfo, null, 2));
    }

    redirectToLogin() {
        window.location.href = "auth";
    }
}
