# SuperTokens + Astro (React)

A demo implementation of [SuperTokens](https://supertokens.com/) with [Astro](https://astro.build/), using Astro's [React integration](https://docs.astro.build/en/guides/integrations-guide/react/) to render React components for the user interface.

## General Info

This project aims to demonstrate how to integrate SuperTokens into an Astro application, leveraging React components for interactive UI, including SuperTokens' pre-built auth UI. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

## Repo Structure

### Source

```
📦src
┣ 📂components
┃ ┣ 📜Auth.tsx  --> React component rendering SuperTokens pre-built auth UI
┃ ┣ 📜Dashboard.tsx  --> React component for dashboard functionality
┃ ┣ 📜Home.tsx  --> React component for home page content
┃ ┗ 📜Root.tsx  --> Root React component, potentially for SuperTokens context/initialization
┣ 📂config
┃ ┣ 📜frontend.ts  --> Frontend config for SuperTokens (used by React components)
┃ ┗ 📜backend.ts  --> Backend config for SuperTokens (used by API routes)
┃ ┗ 📜appInfo.ts  --> Shared app info (appName, domains, etc.)
┣ 📂layouts
┃ ┗ 📜Base.astro  --> Common Astro layout
┣ 📂pages
┃ ┣ 📂auth
┃ ┃ ┣ 📂[...path]
┃ ┃ ┃ ┗ 📜[...route].astro  --> Astro page for auth, renders Auth.tsx
┃ ┃ ┗ 📜[...route].astro  --> Astro page for auth, renders Auth.tsx
┃ ┣ 📂api
┃ ┃ ┣ 📜auth.ts  --> Main auth API request handler
┃ ┃ ┣ 📜ping.ts  --> Public API endpoint example
┃ ┃ ┣ 📜sessioninfo.ts  --> Protected API endpoint example
┃ ┃ ┗ 📂auth
┃ ┃   ┣ 📂[...path]
┃ ┃   ┃ ┗ 📜[...route].ts  --> Auth API routes
┃ ┃   ┗ 📜[...route].ts  --> Auth API routes
┃ ┣ 📜auth.astro  --> Main auth Astro page, renders components/Auth.tsx
┃ ┣ 📜dashboard.astro  --> Protected dashboard Astro page, renders components/Dashboard.tsx
┃ ┗ 📜index.astro  --> Public landing Astro page, renders components/Home.tsx
┣ 📂styles
┃ ┗ 📜app.css  --> Global styles
┗ 📜env.d.ts  --> TypeScript declarations
```

> Note: The nested routes are often used to correctly handle SuperTokens' wildcard routing requirements within Astro's file-based routing system.

## Config

### Astro

The project is a standard Astro application with the `@astrojs/react` integration enabled. You can customize the Astro configuration in `astro.config.mjs`. Refer to the [Astro configuration docs](https://docs.astro.build/en/reference/configuration-reference/) and the [React integration guide](https://docs.astro.build/en/guides/integrations-guide/react/).

### SuperTokens

SuperTokens configuration is split:

-   **`src/config/frontend.ts` (or `.tsx`)**: Contains frontend SuperTokens configuration, initialized within the React components (e.g., in `Root.tsx` or `Auth.tsx`). This includes `appInfo` and recipe configurations for the UI.
-   **`src/config/backend.ts`**: Contains backend SuperTokens configuration for API routes, including `connectionURI`, `apiKey`, and backend recipe details.
-   **`src/config/appInfo.ts`**: Shared application details.

These files will differ based on the [auth recipe](https://supertokens.com/docs/guides) you choose.

## Application Flow

The application uses Astro's file-based routing for pages, which then render React components for dynamic UI, and API endpoints:

1.  **Landing Page (`src/pages/index.astro`)**

    -   Renders the `src/components/Home.tsx` React component.
    -   Publicly accessible, provides navigation.

2.  **Authentication Pages & API (`src/pages/auth/...` & `src/pages/api/auth/...`)**

    -   Astro pages like `src/pages/auth.astro` render the `src/components/Auth.tsx` React component, which handles the SuperTokens pre-built UI.
    -   Backend API endpoints under `/api/auth` handle authentication logic via the SuperTokens backend SDK.

3.  **Protected Dashboard (`src/pages/dashboard.astro`)**

    -   Renders the `src/components/Dashboard.tsx` React component.
    -   Access control is managed server-side in the Astro page, checking the SuperTokens session before rendering the React component.

4.  **Other API Routes (`src/pages/api/*`)**
    -   Handle backend logic, with session verification for protected routes.

When a user visits, Astro pages serve as shells that mount React components for the interactive parts. Session management is handled by SuperTokens across frontend (React) and backend (Astro API routes).

## Customizations

If you want to customize the default auth UI (rendered via React components), you have two options:

1. Refer to the [docs](https://supertokens.com/docs/thirdpartyemailpassword/advanced-customizations/react-component-override/usage) on how to customize the pre-built UI.
2. Roll your own UI by choosing "Custom UI" in the right sidebar in the [docs](https://supertokens.com/docs/thirdpartyemailpassword/quickstart/frontend-setup).

## Additional Resources

-   Custom UI Example (React): https://github.com/supertokens/supertokens-web-js/tree/master/examples/react/with-thirdpartyemailpassword
-   Custom UI Blog post: https://supertokens.medium.com/adding-social-login-to-your-website-with-supertokens-custom-ui-only-5fa4d7ab6402
-   Awesome SuperTokens: https://github.com/kohasummons/awesome-supertokens

## Contributing

Please refer to the [CONTRIBUTING.md](https://github.com/supertokens/create-supertokens-app/blob/master/CONTRIBUTING.md) file in the root of the [`create-supertokens-app`](https://github.com/supertokens/create-supertokens-app) repo.

## Contact us

For any questions, or support requests, please email us at team@supertokens.io, or join our [Discord](https://supertokens.io/discord) server.

## Authors

Created with :heart: by the folks at SuperTokens.io.
