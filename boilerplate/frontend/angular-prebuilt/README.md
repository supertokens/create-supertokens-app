![SuperTokens banner](https://raw.githubusercontent.com/supertokens/supertokens-logo/master/images/Artboard%20%E2%80%93%2027%402x.png)

# SuperTokens ThirdpartyEmailPassword demo app with Angular and React

This demo app demonstrates the following use cases:

-   Login / sign up with SuperTokens
-   Logout
-   Forgot password flow
-   Session management

In this demo, when our root component loads we will initialize the `supertokens-auth-react` SDK which will handle the whole authentication flow.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.6.

## Project setup

Clone the repo, enter the directory, and use `npm` to install the project dependencies:

```bash
git clone https://github.com/supertokens/supertokens-auth-react
cd supertokens-auth-react/examples/with-angular-thirdpartyemailpassword
npm install
```

## Run the demo app

This compiles and serves the Angular App on port `4200` and starts up a server on port `3001`

### Dev build

```bash
npm run dev
```

### Production build

```bash
npm run start
```

The app will start on `http://localhost:4200`

## Project structure

### Backend

-   The backend API is in the `server.ts` file.

### Frontend

-   The frontend code is located in the `/src` folder.
-   Our frontend will have 3 Angular components, a `home`, `auth` and `root` component.
-   `supertokens-auth-react` will be used in `home` for session management and in the `auth` for Authentication flows and UI.
-   Since `supertokens-auth-react` SDK uses `supertokens-web-js` underneath we only need to initialize `supertokens-auth-react` on the main route.
-   The `root` component contains our routing logic with references to the the `home` and `auth` component modules to enable code splitting.

## Author

Created with :heart: by the folks at supertokens.com.

## License

This project is licensed under the Apache 2.0 license.
