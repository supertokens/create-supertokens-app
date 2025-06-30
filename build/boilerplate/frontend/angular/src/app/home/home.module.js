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
exports.HomeModule = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const home_routing_module_1 = require("./home-routing.module");
const home_component_1 = require("./home.component");
let HomeModule = class HomeModule {};
HomeModule = __decorate(
    [
        (0, core_1.NgModule)({
            declarations: [home_component_1.HomeComponent],
            imports: [common_1.CommonModule, home_routing_module_1.HomeRoutingModule],
        }),
    ],
    HomeModule
);
exports.HomeModule = HomeModule;
