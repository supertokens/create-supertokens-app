# SuperTokens + SvelteKit Demo

A demo implementation of [SuperTokens](https://supertokens.com/) with [SvelteKit](https://kit.svelte.dev/), using SuperTokens' prebuilt UI.

## General Info

This project aims to demonstrate how to integrate SuperTokens into a SvelteKit application using our prebuilt UI. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

## Repo Structure

### Source

```txt
📦src
┣ 📂config
┃ ┣ 📜appInfo.ts --> App info / config, reused across both frontend and backend
┃ ┣ 📜backend.ts --> Backend initialization and configuration
┃ ┗ 📜frontend.ts --> Frontend initialization and configuration
┣ 📂routes
┃ ┣ 📂api
┃ ┃ ┣ 📂auth
┃ ┃ ┃ ┗ 📜[...path].ts --> Catch-all Auth API route
┃ ┃ ┣ 📂ping
┃ ┃ ┃ ┗ 📜+server.ts --> Public route (no auth required)
┃ ┃ ┗ 📂sessioninfo
┃ ┃   ┗ 📜+server.ts --> Session information endpoint (auth required)
┃ ┣ 📂auth
┃ ┃ ┣ 📜+page.svelte --> SuperTokens Auth UI page
┃ ┃ ┗ 📂[...anything]
┃ ┃   ┗ 📜+page.svelte --> Catch-all route for auth paths
┃ ┣ 📂dashboard
┃ ┃ ┗ 📜+page.svelte --> Dashboard page
┃ ┣ 📜+layout.svelte --> Main app layout with auth initialization
┃ ┗ 📜+page.svelte --> Home page with auth status
┗ 📂styles
┃ ┗ 📜app.css --> Global styles
┗ 📜app.html --> Base HTML template
```

> Note: the nested routes are required due to how SvelteKit handles routing, and how SuperTokens expects wildcard routes.

### Config

#### SvelteKit

The project is a standard SvelteKit application.

You can customize the SvelteKit configuration in `svelte.config.js`. Refer to the [SvelteKit configuration docs](https://kit.svelte.dev/docs/configuration) for more options.

#### SuperTokens

SuperTokens configuration is managed through recipe-specific files in the `config/` directory. Each recipe comes in two parts (due to Astro being treated as a full-stack framework):

-   `frontend.ts` - Frontend config
-   `backend.ts` - Backend config

The `appInfo.ts` file is used to configure the app info / config, and is reused across both frontend and backend.

## Application Flow

The application uses SvelteKit's file-based routing and consists of four main parts:

1. **Entry Point (`+page.svelte`)**

    - Public landing page
    - Navigation to auth and dashboard
    - Project information display

2. **Auth Routes (`/auth/*`)**

    - Handles all authentication flows using React components
    - Uses SuperTokens' pre-built UI
    - Manages login, signup, and password reset
    - Social login integration (when configured)

3. **Protected Dashboard (`/dashboard`)**

    - Only accessible to authenticated users
    - Displays user information
    - Provides authenticated functionality
    - API integration example

4. **API Routes (`/api/*`)**
    - Protected session info endpoint
    - Public ping endpoint
    - Server-side session validation

When a user visits the application, they start at the home page (`/`). They can choose to authenticate through the `/auth` routes, and once authenticated, they gain access to the protected dashboard. The session state is managed throughout the application using SuperTokens' session management.

## Customizations

If you want to customize the default auth UI, you have two options:

1. Refer to the [docs](https://supertokens.com/docs/thirdpartyemailpassword/advanced-customizations/react-component-override/usage) on how to customize the pre-built UI.
2. Roll your own UI by choosing "Custom UI" in the right sidebar in the [docs](https://supertokens.com/docs/thirdpartyemailpassword/quickstart/frontend-setup).

## Additional Resources

-   Custom UI Blog post: https://supertokens.medium.com/adding-social-login-to-your-website-with-supertokens-custom-ui-only-5fa4d7ab6402
-   Awesome SuperTokens: https://github.com/kohasummons/awesome-supertokens

## Contributing

Please refer to the [CONTRIBUTING.md](https://github.com/supertokens/create-supertokens-app/blob/master/CONTRIBUTING.md) file in the root of the [`create-supertokens-app`](https://github.com/supertokens/create-supertokens-app) repo.

## Contributing

Please refer to the [CONTRIBUTING.md](https://github.com/supertokens/create-supertokens-app/blob/master/CONTRIBUTING.md) file in the root of the [`create-supertokens-app`](https://github.com/supertokens/create-supertokens-app) repo.

## Contact us

For any questions, or support requests, please email us at team@supertokens.io, or join our [Discord](https://supertokens.io/discord) server.

## Authors

Created with :heart: by the folks at SuperTokens.io.
