import { Component } from "@angular/core";
import { initSuperTokensWebJS } from "src/config";

initSuperTokensWebJS();

@Component({
    selector: "app-root",
    template: "<router-outlet></router-outlet>",
})
export class AppComponent {
    title = "with-angular-thirdpartyemailpassword";
}
