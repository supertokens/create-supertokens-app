![SuperTokens banner](https://raw.githubusercontent.com/supertokens/supertokens-logo/master/images/Artboard%20%E2%80%93%2027%402x.png)

# SuperTokens with Remix

This demo app demonstrates how to integrate SuperTokens into a Remix application.

Feautures:

-   Initializes SuperTokens with frontend and backend configurations
-   Creates a frontend route to handle authentication-related tasks
-   Integrates the SuperTokens' pre-built login UI for secure user authentication
-   Protects frontend routes to ensure only authenticated users can access the dashboard
-   Exposes the SuperTokens authentication APIs used by frontend widgets

## Project structure & Parameters

```txt
📦[your-app-name]
┣ 📂app
┃ ┣ 📂config
┃ ┃ ┣ 📜appInfo.tsx
┃ ┃ ┣ 📜backend.tsx
┃ ┃ ┗ 📜frontend.tsx
┃ ┣ 📂routes
┃ ┃ ┣ 📜_index.tsx
┃ ┃ ┣ 📜api.auth.$.tsx
┃ ┃ ┗ 📜auth.$.tsx
┃ ┣ 📜app.css
┃ ┣ 📜entry.server.tsx
┃ ┗ 📜root.tsx
┣ 📂assets
┃ ┣ 📂fonts
┃ ┣ 📂images
┣ 📂test
┃ ┗ 📜basic.test.cjs
┣ 📜package.json
┣ 📜remix.config.mjs
┗ 📜server.mjs
```

Let's explore the important files:

| Directory/File       | Description                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| **app**              | Contains configuration files and route files for your application.                              |
|                      | **config**                                                                                      |
|                      | Contains configuration files for your application.                                              |
|                      | `appInfo.tsx` : Includes information about your application reused throughout the app.          |
|                      | `backend.tsx` : Backend-related configuration, including settings for SuperTokens.              |
|                      | `frontend.tsx` : Frontend configuration, including settings for SuperTokens.                    |
|                      | **routes**                                                                                      |
|                      | Contains route files for your application.                                                      |
|                      | `_index.tsx` : Represents the default route or landing page.                                    |
|                      | `api.auth.$.tsx` : Handles authentication-related API endpoints.                                |
|                      | `auth.$.tsx` : Deals with authentication routes or components using SuperTokens.                |
|                      | `entry.server.tsx` : Entry point for server-side rendering (SSR) setup.                         |
|                      | `root.tsx` : Root component of your application.                                                |
| **test**             | Contains test files for your application.                                                       |
|                      | `basic.test.cjs` : A basic test file, presumably for testing functionality in your application. |
| **remix.config.mjs** | Remix configuration file containing settings for your Remix application.                        |
| **server.mjs**       | File responsible for server-side functionality.                                                 |

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
npx create-supertokens-app@latest --frontend=remix
```

-   Follow the instructions on screen

## Author

Created with :heart: by the folks at supertokens.com.

## License

This project is licensed under the Apache 2.0 license.

## Notes

-   To know more about how this app works and to learn how to customise it based on your use cases refer to the [SuperTokens Documentation](https://supertokens.com/docs/guides)
-   We have provided development OAuth keys for the various built-in third party providers in the `/app/config/backend.ts` file. Feel free to use them for development purposes, but **please create your own keys for production use**.
