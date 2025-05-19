# SuperTokens + SvelteKit

A demo implementation of [SuperTokens](https://supertokens.com/) with [SvelteKit](https://kit.svelte.dev/), using SuperTokens' prebuilt UI.

## General Info

This project aims to demonstrate how to integrate SuperTokens into a SvelteKit application using our prebuilt UI. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

## Repo Structure

### Source

```
📦src
┣ 📂config
┃ ┣ 📜appInfo.ts  --> Shared application information
┃ ┣ 📜backend.ts  --> SuperTokens backend configuration
┃ ┗ 📜frontend.ts --> SuperTokens frontend configuration
┣ 📂hooks
┃ ┗ 📜server.ts  --> Server hooks (e.g., for SuperTokens handle) (Optional)
┣ 📂lib
┃ ┗ 📂supertokens <!-- Client-side SuperTokens utilities/wrappers (Optional) -->
┣ 📂routes
┃ ┣ 📜+layout.svelte  --> Root layout, initializes SuperTokens frontend
┃ ┣ 📜+page.svelte  --> Public landing page
┃ ┣ 📂api
┃ ┃ ┣ 📂auth
┃ ┃ ┃ ┗ 📜[...anything]
┃ ┃ ┃   ┗ 📜+server.ts  --> SuperTokens backend auth API handlers
┃ ┃ ┣ 📂ping
┃ ┃ ┃ ┗ 📜+server.ts  --> Example public API endpoint
┃ ┃ ┗ 📂sessioninfo
┃ ┃   ┗ 📜+server.ts  --> Example protected API endpoint
┃ ┣ 📂auth
┃ ┃ ┣ 📜+page.svelte  --> Page for SuperTokens pre-built auth UI
┃ ┃ ┗ 📂[...anything]
┃ ┃   ┗ 📜+page.svelte  --> Catch-all for auth UI paths
┃ ┗ 📂dashboard
┃   ┗ 📜+page.svelte  --> Protected dashboard page
┣ 📜app.d.ts
┣ 📜app.html  --> Main HTML shell
┗ 📜app.postcss
📦static
┣ 📜favicon.png
┗ 📜robots.txt
📜svelte.config.js
📜vite.config.ts
📜package.json
📜tsconfig.json
```

> Note: The nested routes are often used to correctly handle SuperTokens' wildcard routing requirements within SvelteKit's file-based routing system.

## Config

### SvelteKit

This project is a standard SvelteKit application.

-   `svelte.config.js`: Main SvelteKit configuration.
-   `vite.config.ts`: Vite configuration (SvelteKit uses Vite).
-   `src/routes/`: Directory for file-system based routing (pages and server endpoints).
-   `src/hooks.server.ts`: For server-side hooks, potentially for SuperTokens request handling.
-   The default development server runs on port `5173` (or as configured).

### SuperTokens

SuperTokens configuration is split for frontend and backend:

-   **`src/config/frontend.ts`**: Contains frontend-specific SuperTokens configuration, typically initialized in `src/routes/+layout.svelte` or a client-side script.
-   **`src/config/backend.ts`**: Contains backend-specific SuperTokens configuration, used by SvelteKit server endpoints in `src/routes/api/auth/` and server hooks.
-   **`src/config/appInfo.ts`**: Shared application details.

This setup is due to SvelteKit being a full-stack framework. These files will differ based on the [auth recipe](https://supertokens.com/docs/guides) you choose.

## Application Flow

SvelteKit uses file-based routing for pages and server endpoints. Load functions run on the server (or both server/client) for data fetching, and actions handle form submissions.

1.  **Root Layout (`src/routes/+layout.svelte`)**

    -   The main layout for all pages.
    -   Initializes the SuperTokens frontend SDK using configuration from `src/config/frontend.ts`.

2.  **Frontend Pages (`src/routes/`)**

    -   **Landing Page (`src/routes/+page.svelte`)**: Publicly accessible.
    -   **Authentication Page (`src/routes/auth/+page.svelte` & `src/routes/auth/[...anything]/+page.svelte`)**: Renders the SuperTokens pre-built UI.
    -   **Dashboard Page (`src/routes/dashboard/+page.svelte`)**: Protected page. Its `load` function (server-side) verifies the SuperTokens session.

3.  **Server Endpoints & Hooks**
    -   **SuperTokens Auth Handlers (`src/routes/api/auth/[...anything]/+server.ts`)**: SvelteKit endpoint files that handle backend authentication logic by delegating to the SuperTokens backend SDK.
    -   **Server Hooks (`src/hooks.server.ts`)**: Can be used to integrate SuperTokens session management into the SvelteKit request lifecycle.
    -   **Example Protected API (`src/routes/api/sessioninfo/+server.ts`)**: A SvelteKit endpoint whose handlers require a valid SuperTokens session.

When a user visits, SvelteKit processes requests. `+layout.svelte` initializes SuperTokens on the client. Navigating to `/auth` shows the UI. Authenticated users can access `/dashboard` (protected by its `load` function) and protected API endpoints.

## Customizations

If you want to customize the default auth UI, you have two options:

1. Refer to the [docs](https://supertokens.com/docs/thirdpartyemailpassword/advanced-customizations/svelte-component-override/usage) on how to customize the pre-built UI (select Svelte in the framework option).
2. Roll your own UI by choosing "Custom UI" in the right sidebar in the [docs](https://supertokens.com/docs/thirdpartyemailpassword/quickstart/frontend-setup) (select Svelte in the framework option).

## Additional Resources

-   Custom UI Blog post: https://supertokens.medium.com/adding-social-login-to-your-website-with-supertokens-custom-ui-only-5fa4d7ab6402 (General, adapt concepts for Svelte)
-   Awesome SuperTokens: https://github.com/kohasummons/awesome-supertokens

## Contributing

Please refer to the [CONTRIBUTING.md](https://github.com/supertokens/create-supertokens-app/blob/master/CONTRIBUTING.md) file in the root of the [`create-supertokens-app`](https://github.com/supertokens/create-supertokens-app) repo.

## Contact us

For any questions, or support requests, please email us at team@supertokens.io, or join our [Discord](https://supertokens.io/discord) server.

## Authors

Created with :heart: by the folks at SuperTokens.io.
