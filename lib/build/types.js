export const allRecipes = [
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
        displayValue: "react",
    },
    {
        id: "next",
        displayValue: "next",
    },
    {
        id: "angular-prebuilt",
        displayValue: "angular",
    },
    {
        id: "vue-prebuilt",
        displayValue: "vue",
    },
];
export function isValidFrontend(frontend) {
    if (allFrontends.filter((i) => i.displayValue === frontend).length !== 0) {
        return true;
    }
    return false;
}
export const allBackends = [
    {
        id: "node",
        displayValue: "node",
    },
    {
        id: "nest",
        displayValue: "nest",
    },
    {
        id: "python",
        displayValue: "python",
    },
    {
        id: "python-flask",
        displayValue: "python-flask",
    },
    {
        id: "python-drf",
        displayValue: "python-drf",
    },
    {
        id: "python-fastapi",
        displayValue: "python-fastapi",
    },
    {
        id: "go-http",
        displayValue: "golang",
    },
];
export function isValidBackend(backend) {
    if (allBackends.filter((i) => i.displayValue === backend).length !== 0) {
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
