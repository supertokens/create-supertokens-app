![SuperTokens banner](https://raw.githubusercontent.com/supertokens/supertokens-logo/master/images/Artboard%20%E2%80%93%2027%402x.png)

# SuperTokens with Astro

This demo app demonstrates how to integrate SuperTokens into an Astro application.

Features:

-   Initializes SuperTokens with frontend and backend configurations
-   Creates a frontend page to handle authentication-related tasks
-   Integrates the SuperTokens' pre-built login UI for secure user authentication
-   Protects frontend to ensure only authenticated users can access the dashboard
-   Exposes the SuperTokens authentication APIs used by frontend widgets

## Project structure

```txt
📦[your-app-name]
┣ 📂public
┃ ┣ 📂assets
┃ ┃ ┣ 📂fonts
┃ ┃ ┗ 📂images
┃ ┗ 📜favicon.svg
┣ 📂src
┃ ┣ 📂components
┃ ┃ ┣ 📜Auth.tsx
┃ ┃ ┣ 📜Home.tsx
┃ ┃ ┣ 📜Root.tsx
┃ ┃ ┣ 📜sessionAuthForAstro.tsx
┃ ┃ ┗ 📜tryRefreshClientComponent.tsx
┃ ┣ 📂layouts
┃ ┃ ┗ 📜Base.astro
┃ ┣ 📂config
┃ ┃ ┣ 📜appInfo.tsx
┃ ┃ ┣ 📜backend.tsx
┃ ┃ ┗ 📜frontend.tsx
┃ ┣ 📂pages
┃ ┃ ┣ 📂auth
┃ ┃ ┃ ┣ 📂[...path]
┃ ┃ ┃ ┃ ┗ 📜[...route].astro
┃ ┃ ┃ ┗ 📜[...route].astro
┃ ┃ ┣ 📂api
┃ ┃ ┃ ┣ 📂auth
┃ ┃ ┃ ┃ ┣ 📂[...path]
┃ ┃ ┃ ┃ ┃ ┗ 📜[...route].ts
┃ ┃ ┃ ┃ ┗ 📜[...route].ts
┃ ┃ ┣ 📜auth.astro
┃ ┃ ┣ 📜index.astro
┃ ┃ ┗ 📜sessioninfo.ts
┃ ┣ 📂styles
┃ ┃ ┗ 📜app.css
┃ ┣ 📜env.d.ts
┃ ┗ 📜superTokensHelpers.ts
┣ 📜astro.config.mjs
┣ 📜package.json
┣ 📜README.md
┗ 📜tsconfig.json
```

Let's explore the important files:

| Directory/File | Description                                                                            |
| -------------- | -------------------------------------------------------------------------------------- |
| **src**        | Contains configuration files, pages and components for your application.               |
| **src/config** | Contains configuration files for your application.                                     |
|                | `appInfo.tsx` : Includes information about your application reused throughout the app. |
|                | `backend.tsx` : Backend-related configuration, including settings for SuperTokens.     |
|                | `frontend.tsx` : Frontend configuration, including settings for SuperTokens.           |
| **pages**      | Contains route files for your application.                                             |
|                | `index.astro` : Represents the default route or landing page.                          |
|                | `auth.astro` : Shows the pre-built auth UI                                             |
|                | `auth/...` : Deals with authentication callbacks using SuperTokens.                    |
|                | `supertokens/...` : Deals with authentication routes or components using SuperTokens.  |

## Run application locally

Follow the steps outlined below to run the application locally:

1. Change directory to the **[your-app-name]** folder.

    ```shell
    cd your-app-name
    ```

2. Run the application with the command below:

    ```shell
    npm run dev
    ```

## How to use

### Using `create-supertokens-app`

-   Run the following command

```bash
npx create-supertokens-app@latest --frontend=astro
```

-   Follow the instructions on screen

### Specific Astro considerations for the pre-built UI method using React directly

Since this demo is using out [pre-built UI](https://supertokens.com/docs/thirdpartyemailpassword/pre-built-ui/setup/frontend), it relies heavily on React. As such, in order to customize the auth and protected / unprotected routes behavior, take a look at the Root component in `src/components/Root.tsx`. The Root component is used in the `src/layouts/Base.astro` layout file, which is used in all demo pages.

In order to create a public route, you can either customize the `isUnprotectedRoute` behavior in the Root component:

```tsx
const unprotectedRoutes = ["/auth", "/my-public-route"];

export default function App({ children }: { children: React.ReactNode }) {
    // const isUnprotectedRoute = location.pathname.startsWith("/auth"); -> remove this
    const isUnprotectedRoute = unprotectedRoutes.some((route) => location.pathname.startsWith(route));

    return (
        <SuperTokensWrapper>{isUnprotectedRoute ? children : <SessionAuth>{children}</SessionAuth>}</SuperTokensWrapper>
    );
}
```

or, use your own layout component, but make sure to check whether a session exists if you'd like to protect that route (see `index.astro` for an example, using `getSessionForSSR`).

### Alternatives

If you'd like a more low-level approach, you can go for a custom UI setup. This amount to using our SDK methods with your UI - you can find an example [here](https://github.com/supertokens/supertokens-web-js/tree/master/examples/astro/with-thirdpartyemailpassword).

If you'd like a simpler setup, you can use our universal pre-built UI. It's still build on React, but it doesn't explicitly depend on having React in your project. As a result, you only have to provide some routess and a div element to render the UI in. You can find an example [here]().

## Author

Created with :heart: by the folks at supertokens.com.

## License

This project is licensed under the Apache 2.0 license.

## Notes

-   To know more about how this app works and to learn how to customise it based on your use cases refer to the [SuperTokens Documentation](https://supertokens.com/docs/guides)
-   We have provided development OAuth keys for the various built-in third party providers in the `/app/config/backend.ts` file. Feel free to use them for development purposes, but **please create your own keys for production use**.
