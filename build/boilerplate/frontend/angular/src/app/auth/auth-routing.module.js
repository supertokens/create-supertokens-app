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
exports.AuthRoutingModule = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const auth_component_1 = require("./auth.component");
const routes = [{ path: "**", component: auth_component_1.AuthComponent }];
let AuthRoutingModule = class AuthRoutingModule {};
AuthRoutingModule = __decorate(
    [
        (0, core_1.NgModule)({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule],
        }),
    ],
    AuthRoutingModule
);
exports.AuthRoutingModule = AuthRoutingModule;
