# SuperTokens + Nuxt

A demo implementation of [SuperTokens](https://supertokens.com/) with [Nuxt](https://nuxt.com/).

## General Info

This project aims to demonstrate how to integrate SuperTokens into a Nuxt application. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

## Repo Structure

### Source

```
📦
┣ 📜app.vue  --> Root Vue component for the Nuxt app
┣ 📂assets
┣ 📂config
┃ ┗ 📜frontend.ts  --> SuperTokens frontend configuration
┣ 📂layouts
┃ ┗ 📜default.vue  --> Default layout for pages
┣ 📂pages
┃ ┣ 📂auth
┃ ┃ ┗ 📜[...slug].vue  --> Page for SuperTokens pre-built auth UI
┃ ┣ 📂dashboard
┃ ┃ ┗ 📜index.vue  --> Protected dashboard page
┃ ┗ 📜index.vue  --> Public landing page
┣ 📂plugins
┃ ┗ 📜supertokens.client.ts  --> Nuxt client plugin to initialize SuperTokens
┣ 📂public
┣ 📂server
┃ ┣ 📂api
┃ ┃ ┣ 📂auth
┃ ┃ ┃ ┗ 📜[...param].ts  --> SuperTokens backend auth API handlers
┃ ┃ ┗ 📜auth.ts  --> (Potentially another auth related API)
┃ ┣ 📂routes
┃ ┃ ┗ 📜sessioninfo.ts  --> Example protected API route
┃ ┗ 📜backend.ts  --> SuperTokens backend configuration
┣ 📜nuxt.config.ts  --> Nuxt main configuration file
┣ 📜package.json
┗ 📜tsconfig.json
```

## Config

### Nuxt

This project uses Nuxt 3. Key configuration files and directories include:

-   `nuxt.config.ts`: Main Nuxt configuration (modules, plugins, runtime config, etc.).
-   `pages/`: Directory for file-system based routing of Vue pages.
-   `server/`: Directory for backend API routes and server middleware.
-   `plugins/`: For Nuxt plugins like `supertokens.client.ts`.
-   The default development server runs on port `3000`.

### SuperTokens

SuperTokens configuration is split for frontend and backend:

-   **`config/frontend.ts`**: Contains frontend-specific SuperTokens configuration, typically initialized via the Nuxt plugin (`plugins/supertokens.client.ts`). This includes `appInfo` and recipe configurations for the UI.
-   **`server/backend.ts`**: Contains backend-specific SuperTokens configuration, used by API routes in `server/api/auth/`. This includes `connectionURI`, `apiKey`, and backend recipe details.

These files will differ based on the [auth recipe](https://supertokens.com/docs/guides) you choose.

## Application Flow

The application leverages Nuxt's conventions for pages, API routes, and plugins:

1.  **Nuxt Client Plugin (`plugins/supertokens.client.ts`)**

    -   Initializes the SuperTokens frontend SDK when the app loads on the client-side, using configuration from `config/frontend.ts`.

2.  **Root Component & Layouts (`app.vue`, `layouts/default.vue`)**

    -   `app.vue` is the main entry point for the Vue application.
    -   Layouts (e.g., `layouts/default.vue`) wrap pages and can provide common UI structure. SuperTokens context or UI wrappers might be included here or in `app.vue`.

3.  **Frontend Pages (`pages/`)**

    -   **Landing Page (`pages/index.vue`)**: Publicly accessible.
    -   **Authentication Page (`pages/auth/[...slug].vue`)**: Renders the SuperTokens pre-built UI.
    -   **Dashboard Page (`pages/dashboard/index.vue`)**: Protected page. Access control is often managed using Nuxt middleware that verifies the SuperTokens session.

4.  **Server API Routes (`server/api/` and `server/routes/`)**
    -   **SuperTokens Auth Handlers (`server/api/auth/[...param].ts`)**: Handles backend authentication logic by delegating to the SuperTokens backend SDK.
    -   **Example Protected API (`server/routes/sessioninfo.ts`)**: Demonstrates an API route requiring a valid SuperTokens session.

When a user visits, Nuxt serves the appropriate page. The SuperTokens plugin initializes the frontend SDK. Navigation to `/auth` shows the SuperTokens UI. Authenticated users can access `/dashboard` (protected by middleware) and protected API routes. Session management is handled by SuperTokens.

## Customizations

If you want to customize the default auth UI, you have two options:

1. Refer to the [docs](https://supertokens.com/docs/thirdpartyemailpassword/advanced-customizations/vue-component-override/usage) on how to customize the pre-built UI (select Vue in the framework option, as Nuxt uses Vue).
2. Roll your own UI by choosing "Custom UI" in the right sidebar in the [docs](https://supertokens.com/docs/thirdpartyemailpassword/quickstart/frontend-setup) (select Vue in the framework option).

## Additional resources

-   Custom UI Example (Vue): https://github.com/kohasummons/supertokens-vue
-   Custom UI Blog post (Vue): https://supertokens.com/blog/how-to-use-supertokens-custom-ui-with-vuejs
-   Awesome SuperTokens: https://github.com/kohasummons/awesome-supertokens

## Contributing

Please refer to the [CONTRIBUTING.md](https://github.com/supertokens/create-supertokens-app/blob/master/CONTRIBUTING.md) file in the root of the [`create-supertokens-app`](https://github.com/supertokens/create-supertokens-app) repo.

## Contact us

For any questions, or support requests, please email us at team@supertokens.io, or join our [Discord](https://supertokens.io/discord) server.

## Authors

Created with :heart: by the folks at SuperTokens.io.
