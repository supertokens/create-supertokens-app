## Summary of change

A brief description of what this PR is about

## Related issues

-   Link to issue1 here
-   Link to issue1 here

## Test plan

-   [ ] If added a new boilerplate
    -   I tested the new boilerplate by running the CLI locally
    -   I tested that the boilerplate is created and works correctly when using command line flags (`--recipe=...` for example)
-   [ ] If added a new recipe, frontend or backend
    -   I tested that the newly added option is usable by passing command line flags (`--recipe=...` for example)

## Checklist for important updates

-   [ ] Changelog has been updated
-   [ ] Changes to the version if needed
    -   In `package.json`
    -   In `package-lock.json`
    -   In `lib/ts/version.ts`
-   [ ] Had run `npm run build-pretty`
-   [ ] Had installed and ran the pre-commit hook
-   [ ] If added a new recipe, I also modified types to include the new recipe in `Recipe` and `allRecipes`
-   [ ] If added a new frontend, I also modified types to include the new frontend in `SupportedFrontends` and `allFrontends` if required
-   [ ] If added a new backend, I also modified types to include the new backend in `SupportedBackends` and `allBackends` if required

## Remaining TODOs for this PR

-   [ ] Item1
-   [ ] Item2
