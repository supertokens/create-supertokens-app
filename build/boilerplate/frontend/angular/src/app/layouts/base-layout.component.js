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
exports.BaseLayoutComponent = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const common_1 = require("@angular/common");
let BaseLayoutComponent = class BaseLayoutComponent {};
BaseLayoutComponent = __decorate(
    [
        (0, core_1.Component)({
            selector: "app-base-layout",
            standalone: true,
            imports: [common_1.CommonModule, router_1.RouterModule],
            template: `
        <header>
            <nav class="header-container">
                <a routerLink="/">
                    <img src="ST.svg" alt="SuperTokens" />
                </a>
                <ul class="header-container-right">
                    <li>
                        <a href="https://supertokens.com/docs//" target="_blank" rel="noopener noreferrer"> Docs </a>
                    </li>
                    <li>
                        <a
                            href="https://github.com/supertokens/create-supertokens-app"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            CLI Repo
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
        <div class="fill" id="home-container">
            <ng-content></ng-content>
            <footer>
                Built with ❤️ by the folks at
                <a href="https://supertokens.io" target="_blank" rel="noopener noreferrer"> supertokens.com </a>
                .
            </footer>
            <img class="separator-line" src="./assets/images/separator-line.svg" alt="separator" />
        </div>
    `,
        }),
    ],
    BaseLayoutComponent
);
exports.BaseLayoutComponent = BaseLayoutComponent;
