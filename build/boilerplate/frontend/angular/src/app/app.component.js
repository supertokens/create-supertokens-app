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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const config_1 = require("../config");
(0, config_1.initSuperTokensWebJS)();
let AppComponent = class AppComponent {
    constructor() {
        this.title = "SuperTokens Demo";
    }
};
AppComponent = __decorate(
    [
        (0, core_1.Component)({
            selector: "app-root",
            standalone: true,
            imports: [router_1.RouterOutlet],
            templateUrl: "./app.component.html",
        }),
    ],
    AppComponent
);
exports.AppComponent = AppComponent;
