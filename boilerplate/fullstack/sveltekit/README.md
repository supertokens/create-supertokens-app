![SuperTokens banner](https://raw.githubusercontent.com/supertokens/supertokens-logo/master/images/Artboard%20%E2%80%93%2027%402x.png)

# SuperTokens with SvelteKit

This demo app demonstrates how to integrate SuperTokens into an SvelteKit application.

Features:

-   Initializes SuperTokens with frontend and backend configurations
-   Creates a frontend page to handle authentication-related tasks
-   Integrates the SuperTokens' pre-built login UI for secure user authentication
-   Protects frontend to ensure only authenticated users can access the dashboard
-   Exposes the SuperTokens authentication APIs used by frontend widgets

## Project structure

```txt
📦[your-app-name]
┣ 📂static
┣ 📂src
┃ ┣ 📂config
┃ ┃ ┣ 📜appInfo.ts
┃ ┃ ┣ 📜backend.ts
┃ ┃ ┗ 📜frontend.ts
┃ ┣ 📂routes
┃ ┃ ┣ 📂auth
┃ ┃ ┃ ┣ 📂[...anything]
┃ ┃ ┃ ┃ ┗ 📜+page.svelte
┃ ┃ ┃ ┗ 📜+page.svelte
┃ ┃ ┣ 📂api
┃ ┃ ┃ ┣ 📂auth
┃ ┃ ┃ ┃ ┣ 📂[...path]
┃ ┃ ┃ ┃ ┃ ┗ 📜+server.ts
┃ ┃ ┃ ┃ ┗ 📜+server.ts
┃ ┃ ┣ 📜+page.svelte
┃ ┃ ┗ 📂sessioninfo
┃ ┃ ┃ ┗ 📜+server.ts
┃ ┗ 📜superTokensHelpers.ts
┣ 📜svelte.config.js
┣ 📜package.json
┣ 📜README.md
┗ 📜tsconfig.json
```

Let's explore the important files:

| Directory/File | Description                                                                           |
| -------------- | ------------------------------------------------------------------------------------- |
| **src**        | Contains configuration files, pages and components for your application.              |
| **src/config** | Contains configuration files for your application.                                    |
|                | `appInfo.ts` : Includes information about your application reused throughout the app. |
|                | `backend.ts` : Backend-related configuration, including settings for SuperTokens.     |
|                | `frontend.ts` : Frontend configuration, including settings for SuperTokens.           |
| **routes**     | Contains route files for your application.                                            |
|                | `+page.svelte` : Represents the default route or landing page.                        |
|                | `auth/...` : Deals with authentication callbacks using SuperTokens.                   |
|                | `api/auth...` : Deals with authentication routes or components using SuperTokens.     |

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
npx create-supertokens-app@latest --frontend=sveltekit
```

-   Follow the instructions on screen

## Author

Created with :heart: by the folks at supertokens.com.

## License

This project is licensed under the Apache 2.0 license.

## Notes

-   To know more about how this app works and to learn how to customise it based on your use cases refer to the [SuperTokens Documentation](https://supertokens.com/docs/guides)
-   We have provided development OAuth keys for the various built-in third party providers in the `/app/config/backend.ts` file. Feel free to use them for development purposes, but **please create your own keys for production use**.
