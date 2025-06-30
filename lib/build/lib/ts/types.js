export const allRecipes = [
    "all_auth",
    "emailpassword",
    "thirdpartyemailpassword",
    "passwordless",
    "thirdpartypasswordless",
    "thirdparty",
    "multitenancy",
    "multifactorauth",
    "webauthn",
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
export const RECIPE_TO_FACTOR_MAPPING = {
    all_auth: ["emailpassword", "thirdparty", "link-email", "link-phone"],
    emailpassword: ["emailpassword"],
    thirdpartyemailpassword: ["emailpassword", "thirdparty"],
    passwordless: ["link-email", "link-phone"],
    thirdpartypasswordless: ["thirdparty", "link-email", "link-phone"],
    thirdparty: ["thirdparty"],
    webauthn: ["webauthn"],
    multitenancy: [
        {
            firstFactors: ["emailpassword", "thirdparty", "link-email", "link-phone"],
            secondFactors: ["otp-phone", "otp-email", "link-phone", "link-email", "totp"],
        },
        {
            firstFactors: ["emailpassword"],
            secondFactors: ["otp-phone", "otp-email"],
        },
    ],
    multifactorauth: {
        firstFactors: ["emailpassword", "thirdparty", "link-email", "link-phone"],
        secondFactors: ["otp-phone", "otp-email", "link-phone", "link-email", "totp"],
    },
};
export const getFactorsFromRecipes = (recipes) => {
    const firstFactors = [];
    const secondFactors = [];
    let hasMFA = false;
    recipes.forEach((recipe) => {
        if (recipe === "multitenancy") {
            const recipeConfig = RECIPE_TO_FACTOR_MAPPING[recipe];
            recipeConfig.forEach((config) => {
                firstFactors.push(...config.firstFactors);
                if (config.secondFactors) {
                    secondFactors.push(...config.secondFactors);
                }
            });
        } else if (recipe === "multifactorauth") {
            hasMFA = true;
            firstFactors.push(...RECIPE_TO_FACTOR_MAPPING[recipe].firstFactors);
            secondFactors.push(...RECIPE_TO_FACTOR_MAPPING[recipe].secondFactors);
        } else {
            firstFactors.push(...RECIPE_TO_FACTOR_MAPPING[recipe]);
        }
    });
    return {
        firstFactors: [...new Set(firstFactors)],
        secondFactors: hasMFA ? [...new Set(secondFactors)] : undefined,
    };
};
export const getRecipesFromFactors = (config) => {
    const recipes = [];
    // Map first factors to recipes
    if (config.firstFactors?.includes("emailpassword") && config.firstFactors?.includes("thirdparty")) {
        recipes.push("thirdpartyemailpassword");
    } else if (config.firstFactors?.includes("emailpassword")) {
        recipes.push("emailpassword");
    } else if (config.firstFactors?.includes("thirdparty")) {
        recipes.push("thirdparty");
    } else if (config.firstFactors?.includes("webauthn")) {
        recipes.push("webauthn");
    }
    if (config.firstFactors?.some((f) => ["link-email", "link-phone"].includes(f))) {
        if (config.firstFactors?.includes("thirdparty")) {
            recipes.push("thirdpartypasswordless");
        } else {
            recipes.push("passwordless");
        }
    }
    // Also check for OTP factors if passwordless hasn't been added yet
    else if (config.firstFactors?.some((f) => ["otp-email", "otp-phone"].includes(f))) {
        // If ONLY otp factors, pushes "passwordless"
        recipes.push("passwordless");
    }
    // If second factors are present, add MFA
    if (config.secondFactors && config.secondFactors.length > 0) {
        // Ensure multifactorauth recipe is added if not already present implicitly
        if (!recipes.includes("multifactorauth")) {
            recipes.push("multifactorauth");
        }
    }
    return [...new Set(recipes)];
};
