# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [unreleased]

## [0.0.57] - 2025-06-20

### Added

-   Added Astro + React (`astro-react`) fullstack boilerplate.
-   Introduced factor-based generation (e.g., `--firstFactors`, `--secondFactors` CLI flags) for more granular recipe selection, complementing pre-defined recipes and interactive mode.
-   Added local development mode (`npm run dev` or `USE_LOCAL_TEMPLATES=true`) for testing local boilerplate and configuration generator changes using `util/localScaffolder.ts`.
-   Added `dedent` dependency to improve Python template generation.

### Changed

-   **Internal Refactor:** Implemented a runtime configuration compiler ([`lib/ts/templateBuilder/compiler.ts`](lib/ts/templateBuilder/compiler.ts)) to dynamically generate recipe-specific configurations. This significantly reduces boilerplate size and redundancy by eliminating the need to store multiple near-identical config files for each recipe within each stack.
-   Standardized and updated README files across all boilerplate projects for consistency and clarity.
-   Improved Python boilerplate generation ([`boilerplate/backend/shared/python/py.ts`](boilerplate/backend/shared/python/py.ts)):
    -   Corrected import order for generated `config.py`.
    -   Enhanced indentation for `additional_config` in third-party provider setups.
    -   Utilized `dedent` for cleaner multi-line Python code generation.
-   Updated [`CONTRIBUTING.md`](CONTRIBUTING.md) to:
    -   Explain the new runtime configuration compilation process.
    -   Revise local testing instructions, recommending `npm run dev`.
-   Performed general recipe cleanup and improvements.

## [0.0.56] - 2025-04-29

-   Adds version checker in preparation for the next major release.

## [0.0.55] - 2024-12-12

-   Adds a Vite-based React implementation. To be used as reference implementation for front-end options.
-   Adds support for `multifactorauth` in Python backends.
-   Adds Koa as a backend option.

## [0.0.54] - 2024-10-13

-   Adds NuxtJS as a fullstack option.

## [0.0.53] - 2024-10-03

-   Corrects what is displayed to the user if they provide a wrong arg.

## [0.0.52] - 2024-09-30

-   Adds SolidJS as a front-end prebuilt UI option.

## [0.0.51] - 2024-09-18

-   Adds SvelteKit as a fullstack option.

## [0.0.50] - 2024-09-11

-   Fixes generation of nextjs with app dir applications.

## [0.0.49] - 2024-08-10

-   Exposes next-app-directory as a flag for frontend

## [0.0.48] - 2024-08-10

-   Changes dashboard demo to use nextjs, and cleans up code

## [0.0.47] - 2024-08-06

-   Modifies Angular and Vue example apps to use bundled UI

## [0.0.46] - 2024-07-18

-   Adds a new flag `--dashboardDemo=true` which can be used to generate an app in which only the backend works, but can be used to show case the dashboard.

## [0.0.45] - 2024-05-29

-   Adds a recipe that enables Email Password + Social Login + Passwordless at the same time

## [0.0.44] - 2024-04-10

-   Adds Astro to the list of frameworks (as full-stack), using the pre-built UI.

## [0.0.43] - 2024-03-21

-   Adds Remix to the list of frameworks (as full-stack)

## [0.0.41] - 2023-12-19

-   Adds multifactorauth recipe

## [0.0.40] - 2023-10-25

-   Adds generation for a nextjs app using the app directory with the Multitenancy recipe

## [0.0.39] - 2023-10-18

-   Adds generation for a nextjs app using the app directory

## [0.0.38] - 2023-09-20

-   Updates repo name and URL for the capacitor template app

## [0.0.37] - 2023-08-24

-   Adds bun support when running the CLI. To use bun when using this tool use the additional `--manager=bun` flag.

## [0.0.36] - 2023-08-24

-   Adds support for multitenancy to golang and python

## [0.0.35] - 2023-08-16

-   Fixes an issue where the CLI would not download additional files when not using the multitenancy recipe

## [0.0.34] - 2023-07-27

-   Fixes an issue where multitenancy could not be used as a command line flag

## [0.0.33] - 2023-07-26

-   Adds sample apps for Multitenancy with Express and Nest on the backend, and React and Next on the frontend.

## [0.0.32] - 2023-06-24

-   Temporarily uses supertokens-auth-react v0.33 instead of latest for Python and Golang because their latest SDKs have not been released yet

## [0.0.31] - 2023-06-21

-   Temporarily disables python and golang apps cause their latest SDKs have not been released yet

## [0.0.30] - 2023-05-03

-   Updated boilerplates to support the 0.32 version of supertokens-auth-react
-   Changed the config structure to enable multiple config files per project

## [0.0.29] - 2023-04-24

-   Fixes to package.json

## [0.0.28] - 2023-04-24

-   Fixes to package.json

## [0.0.27] - 2023-04-24

-   Fixes to package.json

## [0.0.26] - 2023-04-24

-   Changes to use CLI for live demo apps

## [0.0.25] - 2023-02-20

-   Adds Capacitor as an option for frontend stacks. This uses https://github.com/RobSchilderr/capacitor-supertokens-nextjs-turborepo as a template

## [0.0.24] - 2023-02-10

-   Fixes an issue where peer dependencies would not get installed correctly for older versions of npm

## [0.0.23] - 2023-01-06

-   Fixes an issue with golang apps failing to install dependencies
-   Remove extra `dashboard.init()` from flask passwordless boilerplate

## [0.0.22] - 2022-12-21

-   Fixes an issue with golang apps failing to install dependencies

## [0.0.21] - 2022-12-12

-   Fixes an issue where golang apps would not use the latest version of supertokens-golang

## [0.0.20] - 2022-11-04

-   Fixes an issue where python apps would not start because of `source`
-   Python frameworks are now selectable separately from the other backends to reduce clutter

## [0.0.19] - 2022-11-03

-   The dashboard recipe is initialised for all backends by default

## [0.0.18] - 2022-10-21

-   Adds an example app for Python with FastAPI

## [0.0.17] - 2022-10-21

-   Prints the version on startup

## [0.0.16] - 2022-10-21

-   Refactor the order in which the project is setup to fix errors with golang

## [0.0.15] - 2022-10-21

-   Use fetch to directly download files instead of using `got`
-   Updates for analytics

## [0.0.14] - 2022-10-20

-   Changes logic to use Github archive links to download files

## [0.0.13] - 2022-10-18

-   Updates frontend to not add axios interceptor explicitly.

## [0.0.12] - 2022-10-17

-   Displays some information about the tool on startup
-   The tool retries downloading the project if it fails the first time

## [0.0.11] - 2022-10-13

-   Updates NestJS template to have a configurable AuthGuard

## [0.0.10] - 2022-09-29

-   Adds boilerplate for Python using Django Rest Framework

## [0.0.9] - 2022-09-27

-   Use `npm` as the default package manager

## [0.0.8] - 2022-09-27

-   Changes to analytics

## [0.0.7] - 2022-09-23

-   Fixes an issue where download errors were not handled correctly

## [0.0.6] - 2022-09-22

-   Adds analytics

## [0.0.5] - 2022-09-21

-   Removes nextjs frontend only boilerplate

## [0.0.4] - 2022-09-20

-   Changes to the start script

## [0.0.3] - 2022-09-20

-   Enhancements
-   Updates boilerplate apps to make use of latest SDK versions

## [0.0.2] - 2022-09-16

### Fixes

-   Fixes setup scripts for python-flask example app

## [0.0.1] - 2022-09-16

-   Initial Release
