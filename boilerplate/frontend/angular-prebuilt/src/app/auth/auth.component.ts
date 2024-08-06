import { Component, OnDestroy, AfterViewInit, Renderer2, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { initSuperTokensUI } from "src/config";

@Component({
    selector: "app-auth",
    template: '<div id="supertokensui"></div>',
})
export class AuthComponent implements OnDestroy, AfterViewInit {
    constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

    ngAfterViewInit() {
        this.loadScript("https://cdn.jsdelivr.net/gh/supertokens/prebuiltui@v0.44.0/build/static/js/main.38fe3894.js");
    }

    ngOnDestroy() {
        // Remove the script and CSS when the component is destroyed
        const script = this.document.getElementById("supertokens-script");
        if (script) {
            script.remove();
        }
    }

    private loadScript(src: string) {
        const script = this.renderer.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        script.id = "supertokens-script";
        script.onload = () => {
            initSuperTokensUI();
        };
        this.renderer.appendChild(this.document.body, script);
    }
}
