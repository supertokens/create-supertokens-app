# SuperTokens + Astro

A demo implementation of [SuperTokens](https://supertokens.com/) with [Astro](https://astro.build/), using SuperTokens' prebuilt UI.

## General Info

This project aims to demonstrate how to integrate SuperTokens into an Astro application using our prebuilt UI. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

## Repo Structure

### Source

```
📦src
┣ 📂components
┃ ┣ 📜auth.astro  --> Astro component for auth UI
┃ ┗ 📜dashboard.astro  --> Astro component for dashboard functionality
┣ 📂config
┃ ┣ 📜appInfo.ts  --> App info / config, reused across both frontend and backend
┃ ┣ 📜frontend.ts  --> Frontend config for SuperTokens
┃ ┗ 📜backend.ts  --> Backend config for SuperTokens
┣ 📂layouts
┃ ┗ 📜Base.astro  --> Common layout with header and footer
┣ 📂pages
┃ ┣ 📂auth
┃ ┃ ┣ 📂[...path]
┃ ┃ ┃ ┗ 📜[...route].astro  --> Auth page routes (catches all under /auth)
┃ ┃ ┗ 📜[...route].astro  --> Auth page routes (catches all under /auth)
┃ ┣ 📂api
┃ ┃ ┣ 📜auth.ts  --> Main auth API request handler (delegates to SuperTokens)
┃ ┃ ┣ 📜ping.ts  --> Public API endpoint example
┃ ┃ ┣ 📜sessioninfo.ts  --> Protected API endpoint example (requires session)
┃ ┃ ┗ 📂auth
┃ ┃   ┣ 📂[...path]
┃ ┃   ┃ ┗ 📜[...route].ts  --> Auth API routes (catches all under /api/auth)
┃ ┃   ┗ 📜[...route].ts  --> Auth API routes (catches all under /api/auth)
┃ ┣ 📜auth.astro  --> Main auth page (often a shell for client-side rendering of ST UI)
┃ ┣ 📜dashboard.astro  --> Protected dashboard page
┃ ┗ 📜index.astro  --> Public landing page
┣ 📂styles
┃ ┗ 📜app.css  --> Global styles
┗ 📜env.d.ts  --> TypeScript declarations
```

> Note: The nested routes like `[...path]/[...route].astro` are often used to correctly handle SuperTokens' wildcard routing requirements within Astro's file-based routing system.

## Config

### Astro

The project is a standard Astro application. You can customize the Astro configuration in `astro.config.mjs`. Refer to the [Astro configuration docs](https://docs.astro.build/en/reference/configuration-reference/) for more options. The default development server runs on port `4321` unless configured otherwise.

### SuperTokens

SuperTokens configuration is split due to Astro's full-stack nature:

-   **`src/config/frontend.ts`**: Contains the frontend-specific configuration for SuperTokens, such as `appInfo` (appName, websiteDomain, etc.) and the list of recipes to initialize on the client.
-   **`src/config/backend.ts`**: Contains the backend-specific configuration for SuperTokens, including `connectionURI` for the SuperTokens core, `apiKey` (if applicable), and backend recipe configurations.
-   **`src/config/appInfo.ts`**: Often holds shared application information like `appName`, `apiDomain`, `websiteDomain`, `apiBasePath`, and `websiteBasePath` to ensure consistency between frontend and backend configurations.

These files will differ based on the [auth recipe](https://supertokens.com/docs/guides) you choose. If you use this as a starting point, customize these files according to your needs. Refer to our [docs](https://supertokens.com/docs) for details.

## Application Flow

The application uses Astro's file-based routing for pages and API endpoints:

1.  **Landing Page (`src/pages/index.astro`)**

    -   Publicly accessible.
    -   Provides navigation to authentication (`/auth`) and the dashboard (`/dashboard`).

2.  **Authentication Pages & API (`src/pages/auth/...` & `src/pages/api/auth/...`)**

    -   Frontend pages under `/auth` (e.g., `src/pages/auth.astro` or `src/pages/auth/[...route].astro`) render the SuperTokens pre-built UI or your custom authentication UI.
    -   Backend API endpoints under `/api/auth` (e.g., `src/pages/api/auth.ts` or `src/pages/api/auth/[...route].ts`) handle the actual authentication logic by delegating to the SuperTokens backend SDK.

3.  **Protected Dashboard (`src/pages/dashboard.astro`)**

    -   Accessible only to authenticated users. Access control is typically managed by checking the SuperTokens session on the server-side within the Astro component or via middleware.
    -   Displays user-specific information and authenticated functionality.

4.  **Other API Routes (`src/pages/api/*`)**
    -   Example: `src/pages/api/sessioninfo.ts` demonstrates a protected API endpoint that requires a valid SuperTokens session.
    -   Example: `src/pages/api/ping.ts` demonstrates a public API endpoint.

When a user visits the application, they start at the landing page. They can navigate to `/auth` to sign in or sign up. Once authenticated, they can access protected pages like `/dashboard` and protected API routes. Session management is handled by SuperTokens across both frontend and backend.

## Customizations

If you want to customize the default auth UI, you have two options:

1. Refer to the [docs](https://supertokens.com/docs/thirdpartyemailpassword/advanced-customizations/react-component-override/usage) on how to customize the pre-built UI. (Note: While this link is for React, many concepts may apply, especially if Astro components render React components for UI. Check for Astro-specific documentation if available.)
2. Roll your own UI by choosing "Custom UI" in the right sidebar in the [docs](https://supertokens.com/docs/thirdpartyemailpassword/quickstart/frontend-setup).

## Additional Resources

-   Custom UI Astro Example: https://github.com/supertokens/supertokens-web-js/tree/master/examples/astro/with-thirdpartyemailpassword
-   Custom UI Blog post: https://supertokens.medium.com/adding-social-login-to-your-website-with-supertokens-custom-ui-only-5fa4d7ab6402
-   Awesome SuperTokens: https://github.com/kohasummons/awesome-supertokens

## Contributing

Please refer to the [CONTRIBUTING.md](https://github.com/supertokens/create-supertokens-app/blob/master/CONTRIBUTING.md) file in the root of the [`create-supertokens-app`](https://github.com/supertokens/create-supertokens-app) repo.

## Contact us

For any questions, or support requests, please email us at team@supertokens.io, or join our [Discord](https://supertokens.io/discord) server.

## Authors

Created with :heart: by the folks at SuperTokens.io.
