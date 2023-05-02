# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [unreleased]

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
