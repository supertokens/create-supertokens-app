# SuperTokens + Remix

A demo implementation of [SuperTokens](https://supertokens.com/) with [Remix](https://remix.run/).

## General Info

This project aims to demonstrate how to integrate SuperTokens into a Remix application. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

Features:

-   Initializes SuperTokens with frontend and backend configurations
-   Creates a frontend route to handle authentication-related tasks
-   Integrates the SuperTokens' pre-built login UI for secure user authentication
-   Protects frontend routes to ensure only authenticated users can access the dashboard
-   Exposes the SuperTokens authentication APIs used by frontend widgets

## Repo Structure

### Source

```txt
📦
┣ 📂app
┃ ┣ 📂config
┃ ┃ ┣ 📜appInfo.tsx --> Includes information about your application reused throughout the app.
┃ ┃ ┣ 📜backend.tsx --> Backend-related configuration, including settings for SuperTokens.
┃ ┃ ┗ 📜frontend.tsx --> Frontend configuration, including settings for SuperTokens.
┃ ┣ 📂routes
┃ ┃ ┣ 📜_index.tsx --> Public landing page - accessible regardless of auth state.
┃ ┃ ┣ 📜dashboard._index.tsx --> Protected route only accessible to authenticated users.
┃ ┃ ┣ 📜sessioninfo.$.tsx
┃ ┃ ┣ 📜supertokens.$.tsx
┃ ┃ ┗ 📜auth.$.tsx --> Deals with authentication routes or components using SuperTokens.
┃ ┣ 📜app.css
┃ ┣ 📜entry.server.tsx --> Entry point for server-side rendering (SSR) setup.
┃ ┗ 📜root.tsx --> Root component of your application.
┣ 📂assets
┃ ┣ 📂fonts
┣ 📂images
┣ 📂test
┃ ┗ 📜basic.test.cjs
┣ 📜package.json
┣ 📜remix.config.mjs
┗ 📜server.mjs
```

### Config

#### Vite

Remix uses Vite to compile your application. Everything available in the [Vite configuration docs](https://remix.run/docs/en/main/file-conventions/vite-config) is available to use here (refer to the `vite.config.ts` file). The only customization we've done is changing the port to `3000`.

#### SuperTokens

The full configuration needed for SuperTokens (the frontend part) to work is in the `app/config` directory. This file will differ based on the [auth recipe](https://supertokens.com/docs/guides) you choose.

If you choose to use this as a starting point for your own project, you can further customize the options and config in the `app/config` directory. Refer to our [docs](https://supertokens.com/docs) (and make sure to choose the correct recipe) for more details.

## Application Flow

Remix is built on top of [React Router](https://reactrouter.com/). While you can configure routes via the ["routes" plugin option](https://remix.run/docs/en/main/file-conventions/vite-config#routes), most routes are created with the file system convention. Add a file, get a route.

This Demo application consists of four main parts:

1. **Entry Point (`entry.server.tsx`)**

    - Initializes the Remix application on the server-side
    - Handles SuperTokens initialization on the server-side

2. **Root Component (`root.tsx`)**

    - Initializes the Remix application
    - Wraps the application with necessary providers:
        - `SuperTokensWrapper`: Manages auth state and session
    - renders the `App` component
        - unprotected routes are rendered without the SessionAuth wrapper
        - protected routes are rendered with the SessionAuth wrapper

3. **Home page (`/` route, `/routes/_index.tsx` component)**

    - Public landing page accessible to all users
    - Provides navigation to authentication and dashboard
    - Displays basic application information and links

4. **Auth (`/auth` route, `/routes/auth.&.tsx` component)**

    - Renders the SuperTokens' pre-built auth UI

5. **Dashboard page (`/dashboard` route, `/routes/dashboard._index.tsx` component)**
    - Protected route only accessible to authenticated users
    - Protected by `SessionAuth` component
    - Displays user information and session details
    - Provides functionality to:
        - View user ID
        - Call test API endpoints
        - Access documentation
        - Sign out

When a user visits the application, they start at the home page (`/`). They can choose to authenticate through the `/auth` route, and once authenticated, they gain access to the protected dashboard. The session state is managed throughout the application using SuperTokens' session management.

## Customizations

If you want to customize the default auth UI, you have two options:

1. Refer to the [docs](https://supertokens.com/docs/thirdpartyemailpassword/advanced-customizations/react-component-override/usage) on how to customize the pre-built UI.
2. Roll your own UI by choosing "Custom UI" in the right sidebar in the [docs](https://supertokens.com/docs/thirdpartyemailpassword/quickstart/frontend-setup).

## Additional resources

-   Custom UI Example: https://github.com/supertokens/supertokens-web-js/tree/master/examples/react/with-thirdpartyemailpassword
-   Custom UI Blog post: https://supertokens.medium.com/adding-social-login-to-your-website-with-supertokens-custom-ui-only-5fa4d7ab6402
-   Awesome SuperTokens: https://github.com/kohasummons/awesome-supertokens

## Contributing

Please refer to the [CONTRIBUTING.md](https://github.com/supertokens/create-supertokens-app/blob/master/CONTRIBUTING.md) file in the root of the [`create-supertokens-app`](https://github.com/supertokens/create-supertokens-app) repo.

## Contact us

For any questions, or support requests, please email us at team@supertokens.io, or join our [Discord](https://supertokens.io/discord) server.

## Authors

Created with :heart: by the folks at SuperTokens.io.
