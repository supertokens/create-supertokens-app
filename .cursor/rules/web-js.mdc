---
description: 
globs: 
alwaysApply: false
---
## WebJS

| factor          | webjs imports                                            | webjs inits                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `emailpassword` | import SuperTokens from "supertokens-web-js";            | (window as any).supertokensUIEmailPassword.init(),                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `thirdparty`    | import SuperTokens from "supertokens-web-js";            | (window as any).supertokensUIThirdParty.init({<br>                signInAndUpFeature: {<br>                    providers: [<br>                        (window as any).supertokensUIThirdParty.Github.init(),<br>                        (window as any).supertokensUIThirdParty.Google.init(),<br>                        (window as any).supertokensUIThirdParty.Apple.init(),<br>                        (window as any).supertokensUIThirdParty.Twitter.init(),<br>                    ],<br>                },<br>            }), |
| `link_email`    | import Session from "supertokens-web-js/recipe/session"; | (window as any).supertokensUIPasswordless.init({<br>                contactMethod: "EMAIL_OR_PHONE",<br>            }),                                                                                                                                                                                                                                                                                                                                                                                                                |
| `link_phone`    | import Session from "supertokens-web-js/recipe/session"; | (window as any).supertokensUIPasswordless.init({<br>                contactMethod: "EMAIL_OR_PHONE",<br>            }),                                                                                                                                                                                                                                                                                                                                                                                                                |
| `otp_phone`     | import Session from "supertokens-web-js/recipe/session"; | (window as any).supertokensUIPasswordless.init({<br>                contactMethod: "EMAIL_OR_PHONE",<br>            }),                                                                                                                                                                                                                                                                                                                                                                                                                |
| `otp_email`     | import Session from "supertokens-web-js/recipe/session"; | (window as any).supertokensUIPasswordless.init({<br>                contactMethod: "EMAIL_OR_PHONE",<br>            }),                                                                                                                                                                                                                                                                                                                                                                                                                |
| `totp`          | import SuperTokens from "supertokens-web-js";            | (window as any).supertokensUITOTP.init(),<br>            (window as any).supertokensUISession.init(),                                                                                                                                                                                                                                                                                                                                                                                                                                  |

**Notes**: 
- Session, Dashboard, UserRoles also imported for all factors, in addition to their own config.
- if both link_email and link_phone are present as factors, the contactMethod in init becomes "EMAIL_OR_PASSWORD".
- if both otp_email and otp_phone are present as factors, the flowType in init becomes "USER_INPUT_CODE_AND_MAGIC_LINK".
- If a second factor is present, always include the MultiFactorAuth recipe.
- Second factors specific behavior always go in the override function of the MultiFactorAuth recipe!

### Examples

#### All auth

```ts
import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";

export function initSuperTokensUI() {
    (window as any).supertokensUIInit("supertokensui", {
        appInfo: {
            websiteDomain: "http://localhost:3000",
            apiDomain: "http://localhost:3001",
            appName: "SuperTokens Demo App",
        },
        recipeList: [
            (window as any).supertokensUIEmailPassword.init(),
            (window as any).supertokensUIThirdParty.init({
                signInAndUpFeature: {
                    providers: [
                        (window as any).supertokensUIThirdParty.Github.init(),
                        (window as any).supertokensUIThirdParty.Google.init(),
                        (window as any).supertokensUIThirdParty.Apple.init(),
                        (window as any).supertokensUIThirdParty.Twitter.init(),
                    ],
                },
            }),
            (window as any).supertokensUIPasswordless.init({
                contactMethod: "EMAIL_OR_PHONE",
            }),
            (window as any).supertokensUISession.init(),
        ],
    });
}

export function initSuperTokensWebJS() {
    SuperTokens.init({
        appInfo: {
            appName: "SuperTokens Demo App",
            apiDomain: "http://localhost:3001",
        },
        recipeList: [Session.init()],
    });
}
```

#### Multi-factor auth

```ts
import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import MultiFactorAuth from "supertokens-web-js/recipe/multifactorauth";

export function initSuperTokensUI() {
    (window as any).supertokensUIInit("supertokensui", {
        appInfo: {
            websiteDomain: "http://localhost:3000",
            apiDomain: "http://localhost:3001",
            appName: "SuperTokens Demo App",
        },
        recipeList: [
            (window as any).supertokensUIEmailPassword.init(),
            (window as any).supertokensUIThirdParty.init({
                signInAndUpFeature: {
                    providers: [
                        (window as any).supertokensUIThirdParty.Github.init(),
                        (window as any).supertokensUIThirdParty.Google.init(),
                        (window as any).supertokensUIThirdParty.Apple.init(),
                        (window as any).supertokensUIThirdParty.Twitter.init(),
                    ],
                },
            }),
            (window as any).supertokensUIPasswordless.init({
                contactMethod: "EMAIL_OR_PHONE",
            }),
            (window as any).supertokensUIEmailVerification.init({
                mode: "REQUIRED",
            }),
            (window as any).supertokensUIMultiFactorAuth.init({
                firstFactors: ["thirdparty", "emailpassword"],
            }),
            (window as any).supertokensUITOTP.init(),
            (window as any).supertokensUISession.init(),
        ],
    });
}

export function initSuperTokensWebJS() {
    SuperTokens.init({
        appInfo: {
            appName: "SuperTokens Demo App",
            apiDomain: "http://localhost:3001",
        },
        recipeList: [Session.init(), EmailVerification.init(), MultiFactorAuth.init()],
    });
}
```

These rules and examples apply only to [template.ts](mdc:boilerplate/frontend/shared/web-js/template.ts) - and nowhere outside of it.


