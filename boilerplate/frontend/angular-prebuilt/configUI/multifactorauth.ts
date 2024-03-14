import { ThirdPartyEmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/thirdpartyemailpassword/prebuiltui";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";
import { EmailVerificationPreBuiltUI } from "supertokens-auth-react/recipe/emailverification/prebuiltui";
import { MultiFactorAuthPreBuiltUI } from "supertokens-auth-react/recipe/multifactorauth/prebuiltui";
import { TOTPPreBuiltUI } from "supertokens-auth-react/recipe/totp/prebuiltui";

export const PreBuiltUIList = [
    ThirdPartyEmailPasswordPreBuiltUI,
    PasswordlessPreBuiltUI,
    MultiFactorAuthPreBuiltUI,
    EmailVerificationPreBuiltUI,
    TOTPPreBuiltUI,
];
