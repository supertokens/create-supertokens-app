export const allRecipes = [
    "all_auth",
    "emailpassword",
    "thirdpartyemailpassword",
    "passwordless",
    "thirdpartypasswordless",
    "thirdparty",
    "multitenancy",
    "multifactorauth",
];
export function isValidRecipeName(recipe) {
    if (allRecipes.includes(recipe)) {
        return true;
    }
    return false;
}
export const allFrontends = [
    {
        id: "react",
    },
    {
        id: "next",
    },
    {
        id: "next-app-directory",
    },
    {
        id: "astro",
    },
    {
        id: "astro-react",
    },
    {
        id: "remix",
    },
    {
        id: "sveltekit",
    },
    {
        id: "nuxtjs",
    },
    {
        id: "angular",
    },
    {
        id: "vue",
    },
    {
        id: "solid",
    },
];
export function isValidFrontend(frontend) {
    if (allFrontends.filter((i) => i.id === frontend).length !== 0) {
        return true;
    }
    return false;
}
export const allBackends = [
    {
        id: "node",
        frameworks: [{ id: "koa" }, { id: "express" }, { id: "nest" }],
    },
    {
        id: "python",
        frameworks: [{ id: "python-flask" }, { id: "python-drf" }, { id: "python-fastapi" }],
    },
    {
        id: "go-http",
    },
];
export function isValidBackend(backend) {
    return allBackends.some((b) => b.id === backend || (b.frameworks && b.frameworks.some((f) => f.id === backend)));
}
export const allPackageManagers = ["npm", "yarn", "pnpm", "bun"];
export function isValidPackageManager(manager) {
    if (allPackageManagers.includes(manager)) {
        return true;
    }
    return false;
}
