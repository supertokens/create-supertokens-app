import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { initSuperTokensWebJS } from "../config";

initSuperTokensWebJS();

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: "./app.component.html",
})
export class AppComponent {
    title = "SuperTokens Demo";
}
