# SuperTokens + Astro (React)

A demo implementation of [SuperTokens](https://supertokens.com/) with [Astro](https://astro.build/) (using the React Adapter). Built with Astro's [React integration](https://docs.astro.build/en/guides/integrations-guide/react/).

## General Info

This project aims to demonstrate how to integrate SuperTokens into an Astro application using React components for interactive auth UI. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

## Repo Structure

### Source

```
📦src
┣ 📂components
┃ ┣ 📜Auth.tsx  --> React component for auth UI
┃ ┣ 📜Dashboard.tsx  --> React component for dashboard functionality
┃ ┗ 📜Home.tsx  --> React component for home page content
┃ ┗ 📜Root.tsx  --> Root React component for auth state
┣ 📂config
┃ ┣ 📜appInfo.ts  --> App info / config, reused across both frontend and backend
┃ ┗ 📜frontend.ts  --> Frontend config
┃ ┗ 📜backend.ts  --> Backend config
┣ 📂layouts
┃ ┗ 📜Base.astro  --> Common layout with header and footer
┣ 📂pages
┃ ┣ 📂auth
┃ ┣ ┣ 📂[...path]
┃ ┃ ┃ ┗ 📜[...route].astro  --> Auth routes
┃ ┃ ┗ 📜[...route].astro  --> Auth routes
┃ ┣ 📂api
┃ ┃ ┣ 📜 auth.ts  --> Auth request handler
┃ ┃ ┣ 📜 ping.ts  --> Public API endpoint
┃ ┃ ┣ 📜 sessioninfo.ts  --> Protected API endpoint
┃ ┃ ┗ 📂auth
┃ ┃   ┣ 📂[...path]
┃ ┃   ┃ ┗ 📜[...route].ts  --> Auth request handler
┃ ┃   ┗ 📜[...route].ts  --> Auth request handler
┃ ┣ 📜auth.astro  --> Main auth page
┃ ┣ 📜dashboard.astro  --> Protected dashboard page
┃ ┗ 📜index.astro  --> Public landing page
┣ 📂styles
┃ ┗ 📜app.css  --> Global styles
┗ 📜env.d.ts  --> TypeScript declarations
```

> Note: the nested routes are required due to how Astro handles routing, and how SuperTokens expects wildcard routes.

### Config

#### Astro

The project is a standard Astro application with the following configuration:

-   React integration for interactive components
-   Port 4321 for development server

You can customize the Astro configuration in `astro.config.mjs`. Refer to the [Astro configuration docs](https://docs.astro.build/en/reference/configuration-reference/) for more options.

#### SuperTokens

SuperTokens configuration is managed through recipe-specific files in the `config/` directory. Each recipe comes in two parts (due to Astro being treated as a full-stack framework):

-   `frontend.ts` - Frontend config
-   `backend.ts` - Backend config

The `appInfo.ts` file is used to configure the app info / config, and is reused across both frontend and backend.

## Application Flow

The application uses Astro's file-based routing and consists of four main parts:

1. **Entry Point (`index.astro`)**

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

-   Custom UI Example: https://github.com/supertokens/supertokens-web-js/tree/master/examples/react/with-thirdpartyemailpassword
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
