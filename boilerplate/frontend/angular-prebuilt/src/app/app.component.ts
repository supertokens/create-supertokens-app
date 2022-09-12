import { Component } from "@angular/core";
import { SuperTokensWebJSConfig } from "src/config";

import * as SuperTokens from "supertokens-web-js";

SuperTokens.init(SuperTokensWebJSConfig);

@Component({
    selector: "app-root",
    template: "<router-outlet></router-outlet>",
})
export class AppComponent {
    title = "with-angular-thirdpartyemailpassword";
}
