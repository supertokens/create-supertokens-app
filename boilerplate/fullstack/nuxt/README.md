# SuperTokens + Nuxt

A demo implementation of [SuperTokens](https://supertokens.com/) with [Nuxt](https://nuxt.com/).

## General Info

This project aims to demonstrate how to integrate SuperTokens into a Nuxt application. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

## Repo Structure

### Source

```
📦
┣ 📜README.md
┣ 📜app.vue
┣ 📂assets
┣ 📂components
┃ ┣ 📜Footer.vue
┃ ┗ 📜SessionInfo.vue
┣ 📂config
┃ ┣ 📜appInfo.ts  --> SuperTokens configuration
┃ ┗ 📜frontend.ts
┣ 📂layouts
┃ ┗ 📜default.vue
┣ 📜nuxt.config.ts
┣ 📜package-lock.json
┣ 📜package.json
┣ 📂pages
┃ ┣ 📂auth
┃ ┃ ┗ 📜[...slug].vue  --> "Auth" view, accessible regardless of the logged-in state of the app
┃ ┣ 📂dashboard
┃ ┃ ┗ 📜index.vue  --> "Dashboard" view, accessible only via the logged-in state of the app
┃ ┗ 📜index.vue  --> "Home" view, accessible regardless of the logged-in state of the app
┣ 📂plugins
┃ ┗ 📜supertokens.client.ts
┣ 📂public
┣ 📂server
┃ ┣ 📂api
┃ ┃ ┣ 📂auth
┃ ┃ ┃ ┗ 📜[...param].ts  --> API routes for authentication
┃ ┃ ┗ 📜auth.ts
┃ ┣ 📜backend.ts  --> SuperTokens backend configuration
┃ ┣ 📂routes
┃ ┃ ┗ 📜sessioninfo.ts  --> API routes
┃ ┣ 📜tsconfig.json
┃ ┗ 📂utils
┃   ┗ 📜convertToRequest.ts
┗ 📜tsconfig.json
```

### Source

### Config

#### SuperTokens

The full configuration needed for SuperTokens (the frontend part) to work is in the `src/config` directory. This files in this directory will differ based on the [auth recipe](https://supertokens.com/docs/guides) you choose.

If you choose to use this as a starting point for your own project, you can further customize the options and config in the `src/config/appInfo.ts` file. Refer to our [docs](https://supertokens.com/docs) (and make sure to choose the correct recipe) for more details.

## Application Flow

1. **Entry Point (`app.vue`)**

    - Root component of the app
        - `/`: Public landing page - accessible regardless of auth state
        - `/auth`: Renders SuperTokens' pre-built auth UI - accessible regardless of auth state
        - `/dashboard`: Protected route requiring authentication

2. **Home View (`/` route, `/pages/index.vue` component)**

    - Public landing page accessible to all users
    - Provides navigation to authentication and dashboard
    - Displays basic application information and links

3. **Auth View (`/auth` route, `/pages/auth/[...slug].vue` component)**

    - Renders SuperTokens' pre-built auth UI

4. **Dashboard View (`/dashboard` route, `/pages/dashboard/index.vue` component)**
    - Protected route only accessible to authenticated users
    - Protected by middleware
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
