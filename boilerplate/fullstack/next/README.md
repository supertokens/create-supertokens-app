# SuperTokens + Next.js (Pages Router)

A demo implementation of [SuperTokens](https://supertokens.com/) with [Next.js](https://nextjs.org/), using the Pages Router.

## General Info

This project aims to demonstrate how to integrate SuperTokens into a Next.js (Pages Router) application. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

## Repo Structure

### Source

```
📦
┣ 📂assets
┣ 📂config
┃ ┣ 📜appInfo.ts
┃ ┣ 📜backendConfig.ts  --> SuperTokens backend configuration
┃ ┗ 📜frontendConfig.tsx --> SuperTokens frontend configuration
┣ 📂pages
┃ ┣ 📜_app.tsx  --> Custom App component, initializes SuperTokens frontend
┃ ┣ 📂api
┃ ┃ ┣ 📂auth
┃ ┃ ┃ ┗ 📜[[...path]].ts  --> SuperTokens backend auth API handlers
┃ ┃ ┗ 📜user.ts  --> Example protected API route
┃ ┣ 📂auth
┃ ┃ ┗ 📜[[...path]].tsx  --> SuperTokens pre-built auth UI page
┃ ┣ 📂dashboard
┃ ┃ ┗ 📜index.tsx  --> Protected dashboard page
┃ ┗ 📜index.tsx  --> Public landing page
┣ 📂public
┣ 📂styles
┃ ┗ 📜globals.css
┣ 📜next-env.d.ts
┣ 📜next.config.js
┣ 📜package.json
┗ 📜tsconfig.json
```

## Config

### Next.js

This project uses the Next.js Pages Router. Key configuration files and directories include:

-   `next.config.js`: Standard Next.js configuration.
-   `pages/`: Directory for creating pages and API routes.
    -   `_app.tsx`: Custom App component for initializing pages.
    -   `api/`: For backend API routes.
-   The default development server runs on port `3000`.

### SuperTokens

SuperTokens configuration is split into frontend and backend:

-   **`config/frontendConfig.tsx`**: Contains the frontend-specific configuration for SuperTokens, initialized in `pages/_app.tsx`. This includes `appInfo` and recipe configurations for the UI.
-   **`config/backendConfig.ts`**: Contains the backend-specific configuration for SuperTokens, used by API routes in `pages/api/auth/`. This includes `connectionURI`, `apiKey`, and backend recipe details.
-   **`config/appInfo.ts`**: Shared application details like `appName`, `apiDomain`, `websiteDomain`.

These files will differ based on the [auth recipe](https://supertokens.com/docs/guides) you choose.

## Application Flow

The application leverages Next.js Pages Router for file-system based routing for both frontend pages and backend API endpoints:

1.  **Custom App (`pages/_app.tsx`)**

    -   Initializes the SuperTokens frontend SDK using configuration from `config/frontendConfig.tsx`.
    -   Wraps all pages with necessary SuperTokens providers (e.g., `SuperTokensWrapper`).

2.  **Frontend Pages (`pages/`)**

    -   **Landing Page (`pages/index.tsx`)**: Publicly accessible, provides navigation.
    -   **Authentication Page (`pages/auth/[[...path]].tsx`)**: Renders the SuperTokens pre-built UI for login, sign-up, etc.
    -   **Dashboard Page (`pages/dashboard/index.tsx`)**: A protected page, accessible only after authentication. Uses SuperTokens session verification (e.g., `SessionAuth` component or server-side checks).

3.  **API Routes (`pages/api/`)**
    -   **SuperTokens Auth Handlers (`pages/api/auth/[[...path]].ts`)**: Handles all backend authentication logic by delegating to the SuperTokens backend SDK.
    -   **Example Protected API (`pages/api/user.ts`)**: Demonstrates an API route that requires a valid SuperTokens session to access.

When a user visits, Next.js serves the appropriate page. `_app.tsx` ensures SuperTokens is initialized on the frontend. Navigating to `/auth` shows the SuperTokens UI. Authenticated users can access `/dashboard` and protected API routes. Session management is handled by SuperTokens across frontend and backend.

## Customizations

If you want to customize the default auth UI, you have two options:

1. Refer to the [docs](https://supertokens.com/docs/thirdpartyemailpassword/advanced-customizations/react-component-override/usage) on how to customize the pre-built UI.
2. Roll your own UI by choosing "Custom UI" in the right sidebar in the [docs](https://supertokens.com/docs/thirdpartyemailpassword/quickstart/frontend-setup).

## Additional resources

-   Custom UI Example: https://github.com/supertokens/supertokens-web-js/tree/master/examples/react/with-thirdpartyemailpassword
-   Custom UI Blog post: https://supertokens.medium.com/adding-social-login-to-your-website-with-supertokens-custom-ui-only-5fa4d7ab6402
-   Awesome SuperTokens: https://github.com/kohasummons/awesome-supertokens

## Notes

-   To know more about how this app works and to learn how to customise it based on your use cases refer to the [SuperTokens Documentation](https://supertokens.com/docs/guides)
-   We have provided development OAuth keys for the various built-in third party providers in the `config/backendConfig.ts` file. Feel free to use them for development purposes, but **please create your own keys for production use**.

## Contributing

Please refer to the [CONTRIBUTING.md](https://github.com/supertokens/create-supertokens-app/blob/master/CONTRIBUTING.md) file in the root of the [`create-supertokens-app`](https://github.com/supertokens/create-supertokens-app) repo.

## Contact us

For any questions, or support requests, please email us at team@supertokens.io, or join our [Discord](https://supertokens.io/discord) server.

## Authors

Created with :heart: by the folks at SuperTokens.io.
