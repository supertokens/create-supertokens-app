# SuperTokens + Remix

A demo implementation of [SuperTokens](https://supertokens.com/) with [Remix](https://remix.run/).

## General Info

This project aims to demonstrate how to integrate SuperTokens into a Remix application. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

Features:

-   Initializes SuperTokens with frontend and backend configurations.
-   Creates frontend routes to handle authentication-related tasks.
-   Integrates SuperTokens' pre-built login UI.
-   Protects frontend routes and server-side loaders/actions to ensure only authenticated users can access certain parts.
-   Exposes the SuperTokens authentication APIs used by frontend widgets.

## Repo Structure

### Source

```
📦app
┣ 📂components
┃ ┣ 📜sessionAuthForRemix.tsx <!-- Utility for session verification -->
┃ ┗ 📜tryRefreshClientComponent.tsx <!-- Utility for token refresh -->
┣ 📂config
┃ ┣ 📜appInfo.tsx --> Shared application information
┃ ┣ 📜backend.tsx --> SuperTokens backend configuration
┃ ┗ 📜frontend.tsx --> SuperTokens frontend configuration
┣ 📂routes
┃ ┣ 📜_index.tsx --> Public landing page
┃ ┣ 📜api.auth.$.tsx --> SuperTokens backend auth API handlers
┃ ┣ 📜api.tenants.$.tsx <!-- Example API for tenants -->
┃ ┣ 📜auth.$.tsx --> Page for SuperTokens pre-built auth UI
┃ ┣ 📜dashboard._index.tsx --> Protected dashboard page
┃ ┗ 📜sessioninfo.$.tsx --> Example protected API route
┣ 📜app.css
┣ 📜entry.server.tsx --> Server entry point (handles request, may init ST backend)
┣ 📜root.tsx --> Root component (wraps app with SuperTokens frontend)
📦public
┣ 📜favicon.ico
┣ 📜remix.svg
┗ 📜ST.svg
📦assets
┣ 📂fonts
┗ 📂images
📜remix.config.js <!-- Or .mjs -->
📜vite.config.ts
📜package.json
📜tsconfig.json
```

## Config

### Remix & Vite

Remix uses Vite as its compiler.

-   `vite.config.ts`: Vite configuration.
-   `remix.config.js` (or `.mjs`): Remix-specific configurations.
-   Key directories:
    -   `app/root.tsx`: The root component of your application.
    -   `app/entry.server.tsx`: Handles server-side rendering logic.
    -   `app/routes/`: Contains files that define your application's routes (both UI pages and API endpoints via loaders/actions).
-   The default development server runs on port `3000` (often, or as configured).

### SuperTokens

SuperTokens configuration is managed in the `app/config/` directory:

-   **`app/config/frontend.tsx`**: Contains frontend-specific SuperTokens configuration, typically initialized in `app/root.tsx` or a client-side entry point.
-   **`app/config/backend.tsx`**: Contains backend-specific SuperTokens configuration, used by server-side code (loaders, actions, API routes like `app/routes/api.auth.$.tsx`).
-   **`app/config/appInfo.tsx`**: Shared application details.

These files will differ based on the [auth recipe](https://supertokens.com/docs/guides) you choose.

## Application Flow

Remix handles requests on the server first (via loaders and actions in route files) and then renders React components on the client.

1.  **Server Entry (`app/entry.server.tsx`)**

    -   Handles incoming requests on the server. SuperTokens backend SDK might be initialized here or on-demand in API route handlers.

2.  **Root Component (`app/root.tsx`)**

    -   The main shell for all pages.
    -   Initializes the SuperTokens frontend SDK (e.g., by wrapping the app with `SuperTokensWrapper` from `supertokens-auth-react`).
    -   Renders the matched route component.

3.  **Frontend Pages & Server-Side Logic (`app/routes/`)**

    -   **Landing Page (`app/routes/_index.tsx`)**: Publicly accessible.
    -   **Authentication Page (`app/routes/auth.$.tsx`)**: Renders the SuperTokens pre-built UI.
    -   **Dashboard Page (`app/routes/dashboard._index.tsx`)**: Protected page. Its `loader` function on the server verifies the SuperTokens session before rendering.
    -   Each route file can export a `loader` (for data fetching on server) and `action` (for form submissions on server), where SuperTokens session verification and backend logic occur.

4.  **API Routes (within `app/routes/` or dedicated API files)**
    -   **SuperTokens Auth Handlers (e.g., `app/routes/api.auth.$.tsx`)**: These are Remix route files that act as API endpoints. They handle all backend authentication logic by delegating to the SuperTokens backend SDK.
    -   **Example Protected API (`app/routes/sessioninfo.$.tsx`)**: A route file whose `loader` or `action` requires a valid SuperTokens session.

When a user visits, Remix processes the request server-side (running loaders/actions). `app/root.tsx` sets up the frontend SuperTokens context. Navigating to `/auth` shows the UI. Authenticated users can access protected routes and APIs, with session checks happening in loaders/actions.

## Customizations

If you want to customize the default auth UI, you have two options:

1. Refer to the [docs](https://supertokens.com/docs/thirdpartyemailpassword/advanced-customizations/react-component-override/usage) on how to customize the pre-built UI.
2. Roll your own UI by choosing "Custom UI" in the right sidebar in the [docs](https://supertokens.com/docs/thirdpartyemailpassword/quickstart/frontend-setup).

## Additional resources

-   Custom UI Example (React): https://github.com/supertokens/supertokens-web-js/tree/master/examples/react/with-thirdpartyemailpassword
-   Custom UI Blog post: https://supertokens.medium.com/adding-social-login-to-your-website-with-supertokens-custom-ui-only-5fa4d7ab6402
-   Awesome SuperTokens: https://github.com/kohasummons/awesome-supertokens

## Contributing

Please refer to the [CONTRIBUTING.md](https://github.com/supertokens/create-supertokens-app/blob/master/CONTRIBUTING.md) file in the root of the [`create-supertokens-app`](https://github.com/supertokens/create-supertokens-app) repo.

## Contact us

For any questions, or support requests, please email us at team@supertokens.io, or join our [Discord](https://supertokens.io/discord) server.

## Authors

Created with :heart: by the folks at SuperTokens.io.
