# SuperTokens + Vue

A demo implementation of [SuperTokens](https://supertokens.com/) with [Vue](https://vuejs.org/). Based on [Vite](https://vite.dev/).

## General Info

This project aims to demonstrate how to integrate SuperTokens into a Vue application. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

## Repo Structure

### Source

### Config

#### Vite

Given that the project is a standard Vite project, everything available in the [Vite configuration docs](https://vite.dev/config/) is available to use here (refer to the `vite.config.ts` file). The only customization we've done is changing the port to `3000`.

#### SuperTokens

The full configuration needed for SuperTokens (the frontend part) to work is in the `src/config.ts` file. This file will differ based on the [auth recipe](https://supertokens.com/docs/guides) you choose.

If you choose to use this as a starting point for your own project, you can further customize the options and config in the `src/config.ts` file. Refer to our [docs](https://supertokens.com/docs) (and make sure to choose the correct recipe) for more details.

## Application Flow

The application uses [Vue Router](https://router.vuejs.org/) for routing and consists of four main parts:

1. **Entry Point (`main.ts`)**

    - Initializes the Vue application using `createApp`

2. **Root Component (`router/index.ts`)**

    - Sets up the routing structure using `vue-router`
    - Defines three main routes:
        - `/`: Public landing page - accessible regardless of auth state
        - `/auth`: Renders SuperTokens' pre-built auth UI - accessible regardless of auth state
        - `/dashboard`: Protected route requiring authentication

3. **Home Component (`/` route, `/Views/HomeView.vue` component)**

    - Public landing page accessible to all users
    - Provides navigation to authentication and dashboard
    - Displays basic application information and links

4. **Dashboard Component (`/dashboard` route, `/Views/DashboardView.vue` component)**
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

If you want to customize the default auth UI, you can:

-   Roll your own UI by choosing "Custom UI" in the [docs](https://supertokens.com/docs/thirdpartyemailpassword/quickstart/frontend-setup)

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
