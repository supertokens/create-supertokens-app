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

## Contributing to the source code

Before you push your code make sure you have followed the project setup section and added the pre commit hooks.

### Testing your changes

After building your code you can use `npx .` to run the tool locally, make sure the changes you have made work for

-   Any new stacks you may have added
-   Existing Frontend + Backend selection logic
-   Existing full stack selection logic

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
