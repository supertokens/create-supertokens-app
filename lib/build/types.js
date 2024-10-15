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
        id: "remix",
    },
    {
        id: "sveltekit",
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
        id: "nodejs",
    },
    {
        id: "koa",
    },
    {
        id: "express",
    },
    {
        id: "nest",
    },
    {
        id: "python",
    },
    {
        id: "python-flask",
    },
    {
        id: "python-drf",
    },
    {
        id: "python-fastapi",
    },
    {
        id: "go-http",
    },
];
export function isValidBackend(backend) {
    if (allBackends.filter((i) => i.id === backend).length !== 0) {
        return true;
    }
    return false;
}
export const allPackageManagers = ["npm", "yarn", "pnpm", "bun"];
export function isValidPackageManager(manager) {
    if (allPackageManagers.includes(manager)) {
        return true;
    }
    return false;
}
