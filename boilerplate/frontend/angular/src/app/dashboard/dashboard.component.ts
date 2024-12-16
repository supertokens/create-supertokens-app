import { Component } from "@angular/core";
import * as Session from "supertokens-web-js/recipe/session";

@Component({
    selector: "app-dashboard",
    imports: [],
    templateUrl: "./dashboard.component.html",
    styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {
    title = "angularapp";

    public userId = "";
    public session = false;

    ngAfterViewInit() {
        this.getUserInfo();
    }

    async getUserInfo() {
        this.session = await Session.doesSessionExist();
        if (this.session) {
            this.userId = await Session.getUserId();
        } else {
            this.redirect("auth");
        }
    }

    async onLogout() {
        await Session.signOut();
        this.redirect("");
    }

    redirect(location: string) {
        window.location.href = location;
    }

    newWindow(slug: string) {
        window.open(`https://supertokens.com/${slug}`, "_blank")?.focus();
    }

    async callApiClicked() {
        const response = await fetch("http://localhost:3001" + "/sessioninfo");
        const data = await response.json();
        window.alert("Session Information:\n" + JSON.stringify(data, null, 2));
    }
}
