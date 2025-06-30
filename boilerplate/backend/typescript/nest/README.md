# SuperTokens + NestJS

A demo implementation of [SuperTokens](https://supertokens.com/) with [NestJS](https://nestjs.com/). Based on a standard NestJS project structure.

## General Info

This project aims to demonstrate how to integrate SuperTokens into a NestJS backend application. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

## Repo Structure

### Source

```
📦src
┣ 📂auth
┃ ┣ 📂session
┃ ┃ ┗ 📜session.decorator.ts
┃ ┗ 📂supertokens
┃   ┣ 📜supertokens.service.spec.ts
┃   ┣ 📜supertokens.service.ts
┣ 📜app.controller.spec.ts
┣ 📜app.controller.ts
┣ 📜app.module.ts
┣ 📜app.service.ts
┣ 📜config.ts --> Main SuperTokens configuration
┗ 📜main.ts --> Entry point of app
```

## Config

### SuperTokens

The full configuration needed for SuperTokens (the backend part) to work is in the `src/config.ts` file. This file will differ based on the [auth recipe](https://supertokens.com/docs/guides) you choose.

If you choose to use this as a starting point for your own project, you can further customize the options and config in the `src/config.ts` file. Refer to our [docs](https://supertokens.com/docs) (and make sure to choose the correct recipe) for more details.

## Application Flow

When using SuperTokens, the front-end never calls directly to the SuperTokens Core, the service that creates and manages sessions. Instead, the front-end calls to the back-end and the back-end calls to the Core. You can read more about [how SuperTokens works here](https://supertokens.com/docs/thirdpartyemailpassword/architecture).

The back-end application is structured as follows:

1.  **Entry Point (`main.ts`)**

    - Initializes SuperTokens.
    - Sets up CORS headers for sessions with the front-end.
    - Applies the SuperTokens middleware globally or via guards/filters.

2.  **Configuration (`config.ts`)**

    - `supertokensConfig`:
      - `supertokens`:
        - `connectionURI`: Sets the URL that your SuperTokens core is located. By default, it connects to the playground core. In production, you can [host your own core](https://supertokens.com/docs/thirdpartyemailpassword/pre-built-ui/setup/core/with-docker) or create an account to [enable managed hosting](https://supertokens.com/dashboard-saas).
      - `appInfo`: Holds information like your project name.
        - `apiDomain`: Sets the domain your back-end API is on. SuperTokens automatically listens to requests at `${apiDomain}/auth`.
        - `websiteDomain`: Sets the domain your front-end website is on.
      - `recipeList`: An array of recipes for adding SuperTokens features.

## Customizing SuperTokens Behavior

You can customize the behavior of the SuperTokens SDK by adjusting the configuration in `src/config.ts` and by leveraging NestJS constructs like modules, services, guards, and filters. Refer to the [SuperTokens backend SDK documentation](https://supertokens.com/docs/backend/override/built-in-ui) for advanced customizations.

## Additional resources

- Custom UI Example: https://github.com/supertokens/supertokens-web-js/tree/master/examples/react/with-thirdpartyemailpassword
- Custom UI Blog post: https://supertokens.medium.com/adding-social-login-to-your-website-with-supertokens-custom-ui-only-5fa4d7ab6402
- Awesome SuperTokens: https://github.com/kohasummons/awesome-supertokens

## Contributing

Please refer to the [CONTRIBUTING.md](https://github.com/supertokens/create-supertokens-app/blob/master/CONTRIBUTING.md) file in the root of the [`create-supertokens-app`](https://github.com/supertokens/create-supertokens-app) repo.

## Contact us

For any questions, or support requests, please email us at team@supertokens.io, or join our [Discord](https://supertokens.io/discord) server.

## Authors

Created with :heart: by the folks at SuperTokens.com.
