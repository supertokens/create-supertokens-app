import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-base-layout",
    standalone: true,
    imports: [CommonModule, RouterModule],
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
})
export class BaseLayoutComponent {}
