# Contributing

We're so excited you're interested in helping with SuperTokens! We are happy to help you get started, even if you don't have any previous open-source experience :blush:

## New to Open Source?

1. Take a look at [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)
2. Go through the [SuperTokens Code of Conduct](https://github.com/supertokens/create-supertokens-app/blob/master/CODE_OF_CONDUCT.md)

## Where to ask Questions?

1. Check our [Github Issues](https://github.com/supertokens/create-supertokens-app/issues) to see if someone has already answered your question.
2. Join our community on [Discord](https://supertokens.io/discord) and feel free to ask us your questions

## Development Setup

### Prerequisites

-   OS: Linux or macOS (recommended)
-   Nodejs & npm
-   IDE: [VSCode](https://code.visualstudio.com/download)(recommended) or equivalent IDE

### Project Setup

1. Clone the repository: `git clone https://github.com/supertokens/create-supertokens-app`
2. `cd create-supertokens-app`
3. Install project dependencies
    ```
    npm install
    ```
4. Add the git pre-commit hook
    ```
    npm run set-up-hooks
    ```

## Making Changes

### Core logic

1. The core functionality of the tool can be found in `lib/ts`, to make changes to the way the tool functions you can start with `lib/ts/index.ts`.
2. After modifying the code you need to build the project:
    ```
    npm run build-pretty
    ```

### Adding new apps

To add new boilerplate apps to support more tech stacks or to handle a specific use case, you first need to create a folder inside `/boilerplate`.

-   For frontend only stacks, create the folder inside `boilerplate/frontend`
-   For backend only stacks, create the folder inside `boilerplate/backend`
-   For stacks that provide both a frontend and backend (RedwoodJS, NextJS etc for example), create a folder in `boilerplate/fullstack`

Edit the configuration of apps in `lib/ts/config.ts`, by updating the array in either `getFrontendOptions` or `getBackendOptions`. Note that for fullstack frameworks we modify the frontend array only.

Modifying the array automatically includes the stack in the list of choices when the user is answering the question (Refer to `QuestionOption` in `lib/ts/types` to see how to configure each options in the list)

### Adding new command line flags

To add a new flag that a user can pass when using the tool, first modify the `UserFlags` type in `lib/ts/types`. `userArguments` will contain the value of the flag, there should be no mandatory flags so make sure to have the type of the flag be optional.

### Modifying questions

Questions prompted to the user are controlled by `getQuestions` in `lib/ts/config.ts`. The order of the questions is determined by the order of the items in the array.

Modify the array to add/remove/reorder questions. Some questions use the previous answers, make sure to be careful of this when modifying questions.

### Working with Boilerplate Configurations

The configuration files within each boilerplate (e.g., `config.ts`, `config.tsx`) are dynamically generated when a user runs `create-supertokens-app`. Here's how it works and how to contribute to them:

1.  **Source of Truth for Config Logic:**

    -   The actual logic that generates the content of these configuration files resides in JavaScript "template generator" functions. These are located in shared directories within the main `boilerplate/` folder:
        -   Frontend configs: `boilerplate/frontend/shared/<framework>/template.js` (e.g., [`boilerplate/frontend/shared/react/template.js`](boilerplate/frontend/shared/react/template.js) for React, [`boilerplate/frontend/shared/web-js/template.js`](boilerplate/frontend/shared/web-js/template.js) for others like Angular, Vue).
        -   Backend configs: `boilerplate/backend/shared/<language>/<language>.js` (e.g., [`boilerplate/backend/shared/typescript/ts.js`](boilerplate/backend/shared/typescript/ts.js) for Node.js, [`boilerplate/backend/shared/python/py.js`](boilerplate/backend/shared/python/py.js) for Python).
        -   Fullstack configs also use these, with logic in [`lib/ts/templateBuilder/compiler.ts`](lib/ts/templateBuilder/compiler.ts) determining which generator to call for the frontend and backend parts.
    -   These generator functions take the chosen recipe (e.g., "emailpassword") and user-provided CLI flags (`userArguments`) as input to customize the generated configuration string.

2.  **How it Works During Scaffolding:**

    -   When `create-supertokens-app` runs, it first copies or downloads the chosen boilerplate (e.g., `boilerplate/frontend/react/`).
    -   This copied boilerplate includes a `config/` (or similar, e.g. `src/config/`) directory which might initially contain sub-folders with various template files or structures for different recipes. **These sub-folders are temporary.**
    -   The CLI then calls the relevant template generator function (from point 1) via [`lib/ts/templateBuilder/compiler.ts`](lib/ts/templateBuilder/compiler.ts) and [`lib/ts/utils.ts`](lib/ts/utils.ts).
    -   The string output by this generator function is written into the final configuration file (e.g., `src/config.ts`).
    -   After this, the original directory that contained the multiple recipe template files (e.g., `src/config/emailpassword-config/`, `src/config/thirdparty-config/` if they existed) is **deleted**.

3.  **Making Changes to Configurations:**

    -   To change how a specific recipe is configured for a particular framework/language (e.g., to modify the `apiBasePath` for `emailpassword` recipe in a React app), you must edit the corresponding **template generator function** in the `boilerplate/.../shared/...` directory.
    -   For example, to change the React `config.tsx` for the `emailpassword` recipe, you would modify `boilerplate/frontend/shared/react/template.js` to adjust how it generates the output when `configType` is `emailpassword`.
    -   Do **not** attempt to modify files within recipe-specific subfolders inside a boilerplate's `config` directory (e.g., `boilerplate/frontend/react/src/config/emailpassword-config-files/somefile.ts`) expecting them to be directly copied, as these folders are removed after the final config file is generated. The generator functions are the definitive source.

4.  **Testing Configuration Changes:**
    -   When you modify these template generator functions, test your changes by running the CLI locally using `npm run dev`. This script sets `USE_LOCAL_TEMPLATES=true`, ensuring that your local `boilerplate/` changes (including your modified generator functions) are used by the CLI.
    -   Select the relevant framework, language, and recipe to verify that your generated configuration file is correct.

## Contributing to the source code

Before you push your code make sure you have followed the project setup section and added the pre commit hooks.

### Testing your changes

To test your local changes effectively, especially when modifying boilerplate code, configuration generators, or the core logic:

1.  **Use the `dev` script:**

    ```bash
    npm run dev
    ```

    This command runs the CLI using `tsx` (for direct TypeScript execution) and automatically sets the `USE_LOCAL_TEMPLATES=true` environment variable. This ensures that any changes you make to the files in the local `boilerplate/` directory (including shared template generator functions) are used by the CLI.

2.  **For verbose logging:**
    If you need more detailed logs, especially for debugging template paths or compilation steps:

    ```bash
    npm run dev:debug
    ```

    This sets `DEBUG=true` in addition to `USE_LOCAL_TEMPLATES=true`.

3.  **What to test:**

    -   Ensure any new stacks you've added are selectable and scaffold correctly.
    -   Verify that existing frontend + backend selections still work as expected.
    -   Check that existing fullstack selections function correctly.
    -   If you modified configuration generators, test those specific recipes and frameworks.

4.  **Testing a specific branch from GitHub (less common for local dev):**
    If you need to test a version of the boilerplate from a specific branch on GitHub (that isn't your local code), you can still use `npx . --branch=your_branch_name` after building your local CLI changes (`npm run build-pretty`). However, for most local development and testing of boilerplate/core logic changes, `npm run dev` is preferred.
    **Note:** For `--branch` to work, the branch must exist on the GitHub remote.

### Update package version if needed

You should update the package's version following [semantic versioning](https://semver.org/) rules. This needs to be done in these files:

-   `package.json`
-   `lib/ts/version.ts`

### Create a pull request

1. Reference the relevant issue or pull request and give a clear description of changes/features added when submitting a pull request
2. Make sure the PR title follows [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification

## SuperTokens Community

SuperTokens is made possible by a passionate team and a strong community of developers. If you have any questions or would like to get more involved in the SuperTokens community you can check out:

-   [Github Issues](https://github.com/supertokens/create-supertokens-app/issues)
-   [Discord](https://supertokens.io/discord)
-   [Twitter](https://twitter.com/supertokensio)
-   or [email us](mailto:team@supertokens.io)

Additional resources you might find useful:

-   [SuperTokens Docs](https://supertokens.io/docs/community/getting-started/installation)
-   [Blog Posts](https://supertokens.io/blog/)
