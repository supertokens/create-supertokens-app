"use strict";
var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
var __param =
    (this && this.__param) ||
    function (paramIndex, decorator) {
        return function (target, key) {
            decorator(target, key, paramIndex);
        };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const config_1 = require("../../config");
let AuthComponent = class AuthComponent {
    constructor(renderer, document) {
        this.renderer = renderer;
        this.document = document;
    }
    ngAfterViewInit() {
        this.loadScript("${jsdeliveryprebuiltuiurl}");
    }
    ngOnDestroy() {
        // Remove the script and CSS when the component is destroyed
        const script = this.document.getElementById("supertokens-script");
        if (script) {
            script.remove();
        }
    }
    loadScript(src) {
        const script = this.renderer.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        script.id = "supertokens-script";
        script.onload = () => {
            (0, config_1.initSuperTokensUI)();
        };
        this.renderer.appendChild(this.document.body, script);
    }
};
AuthComponent = __decorate(
    [
        (0, core_1.Component)({
            selector: "app-auth",
            template: '<div id="supertokensui"></div>',
        }),
        __param(1, (0, core_1.Inject)(common_1.DOCUMENT)),
    ],
    AuthComponent
);
exports.AuthComponent = AuthComponent;
