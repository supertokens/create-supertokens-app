Here are some example CLI commands using the factor flags (`--firstfactors`, `--secondfactors`) to test various scenarios. Frameworks have been randomized where possible, ensuring MFA-compatible backends (Node/Python) are used when second factors are specified.

**1. Single First Factor:**

-   Generate a React + Express app using only EmailPassword:
    ```bash
    npm run dev:debug -- --frontend react --backend express --firstfactors emailpassword --appname test-app-ep
    ```
-   Generate an Angular + FastAPI app using only ThirdParty:
    ```bash
    npm run dev:debug -- --frontend angular --backend fastapi --firstfactors thirdparty --appname test-app-tp
    ```
-   Generate a Vue + Nest app using only OTP Email (Passwordless):
    ```bash
    npm run dev:debug -- --frontend vue --backend nest --firstfactors otp-email --appname test-app-pl-otp-email
    ```

**2. Multiple First Factors:**

-   Generate a Solid + Flask app using EmailPassword and ThirdParty:
    ```bash
    npm run dev:debug -- --frontend solid --backend flask --firstfactors emailpassword,thirdparty --appname test-app-ep-tp
    ```
-   Generate a React + Koa app using ThirdParty and Link Phone (Passwordless):
    ```bash
    npm run dev:debug -- --frontend react --backend koa --firstfactors thirdparty,link-phone --appname test-app-tp-pl-link-phone
    ```
-   Generate an Angular + Express app using EmailPassword, OTP Phone, and OTP Email (Passwordless):
    ```bash
    npm run dev:debug -- --frontend angular --backend express --firstfactors emailpassword,otp-phone,otp-email --appname test-app-ep-pl-otp-both
    ```

**3. First Factors + Second Factors (2FA/MFA):**

-   Generate a React + Express app using EmailPassword as the first factor and OTP Email as the second factor:
    ```bash
    npm run dev:debug -- --frontend react --backend express --firstfactors emailpassword --secondfactors otp-email --appname test-app-mfa-ep-otp-email
    ```
-   Generate a Vue + FastAPI app using ThirdParty and EmailPassword as first factors and TOTP as the second factor:
    ```bash
    npm run dev:debug -- --frontend vue --backend fastapi --firstfactors thirdparty,emailpassword --secondfactors totp --appname test-app-mfa-tp-ep-totp
    ```
-   Generate a Solid + Nest app using EmailPassword as the first factor and both OTP Phone and OTP Email as second factor options:
    ```bash
    npm run dev:debug -- --frontend solid --backend nest --firstfactors emailpassword --secondfactors otp-phone,otp-email --appname test-app-mfa-ep-otp-both
    ```
-   Generate a React + DRF (Django Rest Framework) app using ThirdParty as the first factor and TOTP as the second factor:
    ```bash
    npm run dev:debug -- --frontend react --backend drf --firstfactors thirdparty --secondfactors totp --appname test-app-mfa-tp-totp-drf
    ```

**4. Fullstack - Single First Factor:**

-   Generate a Next.js (App Router) app using only EmailPassword:
    ```bash
    npm run dev:debug -- --frontend next-app-dir --firstfactors emailpassword --appname test-app-next-app-ep
    ```
-   Generate a Nuxt app using only ThirdParty:
    ```bash
    npm run dev:debug -- --frontend nuxt --firstfactors thirdparty --appname test-app-nuxt-tp
    ```
-   Generate a SvelteKit app using only OTP Phone (Passwordless):
    ```bash
    npm run dev:debug -- --frontend sveltekit --firstfactors otp-phone --appname test-app-sk-pl
    ```
-   Generate an Astro app using only EmailPassword:
    ```bash
    npm run dev:debug -- --frontend astro --firstfactors emailpassword --appname test-app-astro-ep
    ```

**5. Fullstack - Multiple First Factors:**

-   Generate a Next.js (Pages Router) app using EmailPassword and ThirdParty:
    ```bash
    npm run dev:debug -- --frontend next --firstfactors emailpassword,thirdparty --appname test-app-next-ep-tp
    ```
-   Generate an Astro (with React) app using ThirdParty and Link Email:
    ```bash
    npm run dev:debug -- --frontend astro-react --firstfactors thirdparty,link-email --appname test-app-astro-react-tp-link
    ```
-   Generate a Remix app using EmailPassword and OTP Email:
    ```bash
    npm run dev:debug -- --frontend remix --firstfactors emailpassword,otp-email --appname test-app-remix-ep-otp
    ```

**6. Fullstack - MFA:**

-   Generate a Next.js (App Router) app using EmailPassword first factor and TOTP second factor:
    ```bash
    npm run dev:debug -- --frontend next-app-dir --firstfactors emailpassword --secondfactors totp --appname test-app-next-app-mfa
    ```
-   Generate a Nuxt app using ThirdParty first factor and OTP Email second factor:
    ```bash
    npm run dev:debug -- --frontend nuxt --firstfactors thirdparty --secondfactors otp-email --appname test-app-nuxt-mfa
    ```
-   Generate a SvelteKit app using EmailPassword+ThirdParty first factors and OTP Phone second factor:
    ```bash
    npm run dev:debug -- --frontend sveltekit --firstfactors emailpassword,thirdparty --secondfactors otp-phone --appname test-app-sk-multi-mfa
    ```

**7. Multitenancy:**

-   Generate a React Multitenancy app:
    ```bash
    npm run dev:debug -- --recipe multitenancy --frontend react --appname test-app-react-multitenancy
    ```
-   Generate a Next.js (Pages Router) Multitenancy app:
    ```bash
    npm run dev:debug -- --recipe multitenancy --frontend next --appname test-app-next-multitenancy
    ```
-   Generate a Next.js (App Router) Multitenancy app:
    ```bash
    npm run dev:debug -- --recipe multitenancy --frontend next-app-dir --appname test-app-next-app-multitenancy
    ```

You can use these commands to test the generation logic with different factor combinations directly via the CLI.
