# SuperTokens + Express

A demo implementation of [SuperTokens](https://supertokens.com/) with [Express](https://expressjs.com/).

## General Info

This project aims to demonstrate how to integrate SuperTokens into an Express server. Its primary purpose is to serve as an educational tool, but it can also be used as a starting point for your own project.

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

#### SuperTokens

The full configuration needed for the SuperTokens' back-end to work is in the `src/config.ts` file. This file will differ based on the [auth recipe](https://supertokens.com/docs/guides) you choose.

If you choose to use this as a starting point for your own project, you can further customize SuperTokens in the `src/config.ts` file. Refer to our [docs](https://supertokens.com/docs) (and make sure to choose the correct recipe) for more details.

## Application Flow

When using SuperTokens, the front-end never calls directly to the SuperTokens Core, the service that creates and manages sessions. Instead, the front-end calls to the back-end and the back-end calls to the Core. You can read more about [how SuperTokens works here](https://supertokens.com/docs/thirdpartyemailpassword/architecture).

The back-end has two main files:

1. **Entry Point (`main.ts`)**

   - Initializes SuperTokens
   - Adds CORS headers for sessions with the front-end
   - Adds SuperTokens middleware

2. **Configuration (`config.ts`)**
   - `supertokensConfig`:
     - `supertokens`:
       - `connectionURI`: Sets the URL that your SuperTokens core is located. By default, it connects to the playground core. In production, you can [host your own core](https://supertokens.com/docs/thirdpartyemailpassword/pre-built-ui/setup/core/with-docker) or create an account to [enable managed hosting](https://supertokens.com/dashboard-saas)
     - `appInfo`: Holds informaiton like your project name
       - `apiDomain`: Sets the domain your back-end API is on. SuperTokens automatically listens to requests at `${apiDomain}/auth`
       - `websiteDomain`: Sets the domain your front-end website is on
     - `recipeList`: An array of recipes for adding supertokens features

## Additional resources

- Custom UI Example: https://github.com/supertokens/supertokens-web-js/tree/master/examples/react/with-thirdpartyemailpassword
- Custom UI Blog post: https://supertokens.medium.com/adding-social-login-to-your-website-with-supertokens-custom-ui-only-5fa4d7ab6402
- Awesome SuperTokens: https://github.com/kohasummons/awesome-supertokens

## Contributing

Please refer to the [CONTRIBUTING.md](https://github.com/supertokens/create-supertokens-app/blob/master/CONTRIBUTING.md) file in the root of the [`create-supertokens-app`](https://github.com/supertokens/create-supertokens-app) repo.

## Contact us

For any questions, or support requests, please email us at team@supertokens.com, or join our [Discord](https://supertokens.com/discord) server.

## Authors

Created with :heart: by the folks at SuperTokens.com.
