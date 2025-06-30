# SuperTokens + Angular

A demo implementation of [SuperTokens](https://supertokens.com/) with [Angular](https://angular.dev/). Based on the standard [Angular CLI](https://angular.dev/tools/cli) setup.

## General Info

This project aims to demonstrate how to integrate SuperTokens into an Angular application. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

## Repo Structure

### Source

```
📦src
┣ 📂app
┃ ┣ 📂auth
┃ ┣ 📂dashboard
┃ ┣ 📂home
┃ ┣ 📂layouts
┃ ┣ 📜app-routing.module.ts
┃ ┣ 📜app.component.css
┃ ┣ 📜app.component.html
┃ ┣ 📜app.component.ts
┃ ┣ 📜app.config.ts
┃ ┗ 📜app.module.ts
┣ 📂assets
┃ ┣ 📂fonts
┃ ┗ 📂images
┣ 📜config.ts --> SuperTokens configuration
┣ 📜env.d.ts
┣ 📜index.html
┣ 📜main.ts --> Entry point of the app
┗ 📜styles.css
```

## Config

### SuperTokens

The full configuration needed for SuperTokens (the frontend part) to work is in the `src/config.ts` file. This file will differ based on the [auth recipe](https://supertokens.com/docs/guides) you choose.

If you choose to use this as a starting point for your own project, you can further customize the options and config in the `src/config.ts` file. Refer to our [docs](https://supertokens.com/docs) (and make sure to choose the correct recipe) for more details.

## Application Flow

1.  Entry Point (`src/main.ts`) - Initializes Angular, bootstraps `AppModule`.
2.  Root Module (`src/app/app.module.ts`) - Imports necessary modules, including SuperTokens related setup if any.
3.  Root Component (`src/app/app.component.ts`) - Initializes SuperTokens, sets up routing.
4.  Routing (`src/app/app-routing.module.ts`) - Defines public, auth, and protected routes.
5.  Home Component (`src/app/home/home.component.ts`) - Public landing page.
6.  Auth Components (SuperTokens pre-built UI or custom) - Handles login/signup.
7.  Dashboard Component (`src/app/dashboard/dashboard.component.ts`) - Protected route, possibly using Angular route guards integrated with SuperTokens session verification.]

## Customizations

If you want to customize the default auth UI, you have two options:

1. Refer to the [docs](https://supertokens.com/docs/thirdpartyemailpassword/advanced-customizations/angular-component-override/usage) on how to customize the pre-built UI (select Angular in the framework option).
2. Roll your own UI by choosing "Custom UI" in the right sidebar in the [docs](https://supertokens.com/docs/thirdpartyemailpassword/quickstart/frontend-setup) (select Angular in the framework option).

## Additional resources

-   Custom UI Example: https://github.com/supertokens/supertokens-web-js/tree/master/examples/angular/with-thirdpartyemailpassword
-   Awesome SuperTokens: https://github.com/kohasummons/awesome-supertokens

## Contributing

Please refer to the [CONTRIBUTING.md](https://github.com/supertokens/create-supertokens-app/blob/master/CONTRIBUTING.md) file in the root of the [`create-supertokens-app`](https://github.com/supertokens/create-supertokens-app) repo.

## Contact us

For any questions, or support requests, please email us at team@supertokens.io, or join our [Discord](https://supertokens.io/discord) server.

## Authors

Created with :heart: by the folks at SuperTokens.io.
