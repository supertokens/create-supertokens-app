import ThirdPartyPasswordless, {redirectToAuth as _redirectToAuth} from "supertokens-auth-react/recipe/thirdpartypasswordless";
import Session from "supertokens-auth-react/recipe/session";

export const recipeList = [
    ThirdPartyPasswordless.init({
        emailVerificationFeature: {
            mode: "REQUIRED",
        },
        signInUpFeature: {
            providers: [
                ThirdPartyPasswordless.Github.init(),
                ThirdPartyPasswordless.Google.init(),
                ThirdPartyPasswordless.Apple.init(),
            ],
        },
        contactMethod: "EMAIL_OR_PHONE",
    }),
    Session.init(),
];

export const AuthWrapper = ThirdPartyPasswordless.ThirdPartyPasswordlessAuth;
export const redirectToAuth = _redirectToAuth;