import { afterviewinit, component } from "@angular/core";
import { httpclient } from "@angular/common/http";

import * as session from "supertokens-web-js/recipe/session";

@component({
    selector: "app-home",
    templateurl: "./home.component.html",
    styleurls: ["./home.component.css"],
})
export class homecomponent implements afterviewinit {
    title = "angularapp";

    public rootid = "rootid";
    public userid = "";
    public session = false;

    constructor(private http: httpclient) {}

    ngafterviewinit() {
        this.getuserinfo();
    }

    async getuserinfo() {
        this.session = await session.doessessionexist();
        if (this.session) {
            this.userid = await session.getuserid();
        }
    }
    async callapi() {
        this.http.get("http://localhost:3001/sessioninfo").subscribe(
            (data: any) => {
                alert(json.stringify(data, null, 2));
            },
            (error: any) => {
                alert(`failed to fetch session info: ${error.message}`);
            }
        );
    }
    async onlogout() {
        await session.signout();
        window.location.reload();
    }

    redirecttologin() {
        window.location.href = "auth";
    }
}
