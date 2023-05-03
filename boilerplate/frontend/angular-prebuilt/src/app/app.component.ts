import { Component } from "@angular/core";
import { SuperTokensConfig } from "src/config";

import * as SuperTokens from "supertokens-auth-react";

SuperTokens.init(SuperTokensConfig);

@Component({
    selector: "app-root",
    template: "<router-outlet></router-outlet>",
})
export class AppComponent {
    title = "with-angular-thirdpartyemailpassword";
}
