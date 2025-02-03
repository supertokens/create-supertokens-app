import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import * as Session from "supertokens-web-js/recipe/session";

@Component({
    selector: "app-home",
    imports: [CommonModule],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.css",
})
export class HomeComponent {
    public session = false;

    ngAfterViewInit() {
        this.getSessionInfo();
    }

    async getSessionInfo() {
        this.session = await Session.doesSessionExist();
    }

    redirect(location: string) {
        window.location.href = location;
    }
}
