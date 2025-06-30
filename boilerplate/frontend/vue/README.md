# SuperTokens + Vue

A demo implementation of [SuperTokens](https://supertokens.com/) with [Vue](https://vuejs.org/). Based on [Vite](https://vite.dev/).

## General Info

This project aims to demonstrate how to integrate SuperTokens into a Vue application. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

## Repo Structure

### Source

```
📦src
┣ 📂assets
┃ ┣ 📂fonts
┃ ┗ 📂images
┣ 📂layouts
┃ ┗ 📜BaseLayout.vue
┣ 📂router
┃ ┗ 📜index.ts --> Vue Router configuration
┣ 📂views
┃ ┣ 📜AuthView.vue
┃ ┣ 📜DashboardView.vue
┃ ┗ 📜HomeView.vue
┣ 📜App.vue --> Root component of the app
┣ 📜config.ts --> SuperTokens configuration
┣ 📜main.ts --> Entry point of the app
┣ 📜style.css
┗ 📜vite-env.d.ts
```

## Config

### Vite

Given that the project is a standard Vite project, everything available in the [Vite configuration docs](https://vite.dev/config/) is available to use here (refer to the `vite.config.ts` file). The only customization we've done is changing the port to `3000`.

### SuperTokens

The full configuration needed for SuperTokens (the frontend part) to work is in the `src/config.ts` file. This file will differ based on the [auth recipe](https://supertokens.com/docs/guides) you choose.

If you choose to use this as a starting point for your own project, you can further customize the options and config in the `src/config.ts` file. Refer to our [docs](https://supertokens.com/docs) (and make sure to choose the correct recipe) for more details.

## Application Flow

The application uses [Vue Router](https://router.vuejs.org/) for routing and consists of four main parts:

1.  **Entry Point (`main.ts`)**

    -   Initializes the Vue application using `createApp`.
    -   Initializes SuperTokens with the provided configuration (from `src/config.ts`).
    -   Mounts the root `App` component.
    -   Sets up the Vue router.

2.  **Root Component (`App.vue`)**

    -   Serves as the main layout for the application.
    -   Uses `<router-view>` to render the component for the current route.
    -   May include SuperTokens wrapper components if required by the chosen recipe or for UI customization.

3.  **Routing (`router/index.ts`)**

    -   Sets up the routing structure using `vue-router`.
    -   Defines three main routes:
        -   `/`: Public landing page (`HomeView.vue`) - accessible regardless of auth state.
        -   `/auth`: Renders SuperTokens' pre-built auth UI or custom auth components (`AuthView.vue`) - accessible regardless of auth state.
        -   `/dashboard`: Protected route (`DashboardView.vue`) requiring authentication, typically protected by a route guard.

4.  **View Components (`views/`)**
    -   **Home Component (`HomeView.vue`)**:
        -   Public landing page accessible to all users.
        -   Provides navigation to authentication and dashboard.
    -   **Dashboard Component (`DashboardView.vue`)**:
        -   Protected route only accessible to authenticated users.
        -   Protected by a route guard in `router/index.ts` that verifies the SuperTokens session.
        -   Displays user information and provides authenticated functionality.

When a user visits the application, they start at the home page (`/`). They can choose to authenticate through the `/auth` route, and once authenticated, they gain access to the protected dashboard. The session state is managed throughout the application using SuperTokens' session management.

## Customizations

If you want to customize the default auth UI, you have two options:

1. Refer to the [docs](https://supertokens.com/docs/thirdpartyemailpassword/advanced-customizations/vue-component-override/usage) on how to customize the pre-built UI (select Vue in the framework option).
2. Roll your own UI by choosing "Custom UI" in the right sidebar in the [docs](https://supertokens.com/docs/thirdpartyemailpassword/quickstart/frontend-setup) (select Vue in the framework option).

## Additional resources

-   Custom UI Example: https://github.com/kohasummons/supertokens-vue
-   Custom UI Blog post: https://supertokens.com/blog/how-to-use-supertokens-custom-ui-with-vuejs
-   Awesome SuperTokens: https://github.com/kohasummons/awesome-supertokens

## Contributing

Please refer to the [CONTRIBUTING.md](https://github.com/supertokens/create-supertokens-app/blob/master/CONTRIBUTING.md) file in the root of the [`create-supertokens-app`](https://github.com/supertokens/create-supertokens-app) repo.

## Contact us

For any questions, or support requests, please email us at team@supertokens.io, or join our [Discord](https://supertokens.io/discord) server.

## Authors

Created with :heart: by the folks at SuperTokens.io.
