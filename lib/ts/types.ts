export type Recipe =
    | "all_auth"
    | "emailpassword"
    | "thirdpartyemailpassword"
    | "passwordless"
    | "thirdpartypasswordless"
    | "thirdparty"
    | "multitenancy"
    | "multifactorauth"
    | "webauthn";

export const allRecipes: Recipe[] = [
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

export function isValidRecipeName(recipe: string): recipe is Recipe {
    if (allRecipes.includes(recipe as Recipe)) {
        return true;
    }

    return false;
}

export type SupportedFrontends =
    | "react"
    | "next"
    | "next-multitenancy"
    | "next-app-directory"
    | "next-app-directory-multitenancy"
    | "remix"
    | "astro"
    | "astro-react"
    | "sveltekit"
    | "nuxtjs"
    | "angular"
    | "vue"
    | "solid"
    | "capacitor"
    /*
     * react-multitenancy is intentionally not added to allFrontends because the user is not expected to use this
     * as an option directly and should not be aware of it.
     */
    | "react-multitenancy";

export const allFrontends: {
    id: SupportedFrontends;
}[] = [
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

export function isValidFrontend(frontend: string): frontend is SupportedFrontends {
    if (allFrontends.filter((i) => i.id === frontend).length !== 0) {
        return true;
    }

    return false;
}

type BackendFrameworks = "node" | "python" | "go-http";
type PythonFrameworks = "python-flask" | "python-drf" | "python-fastapi";
type NodeJSFrameworks = "koa" | "express" | "nest";

export type SupportedBackends = BackendFrameworks | NodeJSFrameworks | PythonFrameworks;

export const allBackends: {
    id: BackendFrameworks;
    frameworks?: {
        id: SupportedBackends;
    }[];
}[] = [
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

export function isValidBackend(backend: string): backend is SupportedBackends {
    return allBackends.some((b) => b.id === backend || (b.frameworks && b.frameworks.some((f) => f.id === backend)));
}

type ExternalAppInfo =
    | {
          isExternal: false;
      }
    | {
          isExternal: true;
          /**
           * This message will be printed after downloading the external repo. This can be used as a way to highlight some
           * information to the user or simple linking to the external repo so people can follow the guide from its README
           */
          message: string;
      };

/**
 * value: The option value, this is used to retrieve the selection from inquirer's return
 *
 * shouldDisplay: Whether or not the question should be displayed as a prompt to the user
 *
 * displayName: The text that is displayed to users when prompting
 *
 * isFullStack: Whether or not the selected option is full stack
 *
 * scripts: Commands to run during setup or when starting the app
 *
 * location: Path strings for where to download/locate specific parts from
 *  - main: The path for the folder from where to download the boilerplate
 *  - finalConfig: The path of the config file used by the project, this should include the file extension as well
 *  - configFiles: The path where all the recipe config are (This should be a folder because the recipe name will pre post fixed when loading the config)
 *
 * NOTE: For fullstack options the structure of this object is different
 *
 */
export type QuestionOption = {
    shouldDisplay?: boolean;
    value: SupportedFrontends | SupportedBackends;
    displayName: string;
    script: {
        setup: string[];
        run: string[];
    };
} & (
    | {
          isFullStack?: false;
          externalAppInfo?: ExternalAppInfo;
          location: {
              main: string;
              config: { finalConfig: string; configFiles: string }[];
          };
      }
    | {
          isFullStack: true;
          externalAppInfo?: ExternalAppInfo;
          location: {
              main: string;
              config: {
                  frontend: { finalConfig: string; configFiles: string }[];
                  backend: { finalConfig: string; configFiles: string }[];
              };
          };
      }
);

export type RecipeQuestionOption = {
    value: string;
    displayName: string;
    shouldDisplay?: boolean;
};

export type Answers = {
    frontend?: SupportedFrontends;
    backend?: SupportedBackends;
    recipe: string;
    appname: string;
    backendPython?: PythonFrameworks;
    backendNodeJS?: NodeJSFrameworks;
};

/**
 * download: Location of the repository that contains the frontend and backend projects for the given combination
 * frontend: Path of the frontend project relative to the download location
 * backend: Path of the backend project relative to the download location
 */
export type DownloadLocations = {
    download: string;
    frontend: string;
    backend: string;
    isExternalApp?: boolean;
};

export type SupportedPackageManagers = "npm" | "yarn" | "pnpm" | "bun";

export const allPackageManagers: SupportedPackageManagers[] = ["npm", "yarn", "pnpm", "bun"];

export function isValidPackageManager(manager: string): manager is SupportedPackageManagers {
    if (allPackageManagers.includes(manager as SupportedPackageManagers)) {
        return true;
    }

    return false;
}

export type UserFlagsRaw = {
    dashboardDemo?: string;
    appname?: string;
    recipe?: string;
    branch?: string;
    frontend?: SupportedFrontends;
    backend?: SupportedBackends;
    manager?: SupportedPackageManagers;
    autostart?: string | boolean;
    multitenancy?: boolean;
    firstfactors?: (
        | "emailpassword"
        | "thirdparty"
        | "otp-phone"
        | "otp-email"
        | "link-phone"
        | "link-email"
        | "webauthn"
    )[];
    secondfactors?: ("otp-phone" | "otp-email" | "link-phone" | "link-email" | "totp")[];
    pwcontactmethod?: "email" | "phone" | "email_or_phone";
    providers?: string[]; // Added for selecting specific third-party providers
    skipInstall?: boolean; // Added to skip package installation step
};

// Multi tenancy
// ["emailpassword" | "thirdparty" | "otp-phone" | "otp-email" | "link-phone" | "link-email"]
// ["otp-phone" | "otp-email" | "link-phone" | "link-email" | "totp"]

// emailpassword recipe = emailpassword firstfactor
// thirdparty recipe = thirdparty firstfactor
// paswordless recipe = link-email and link-phone firstfactors
// thirdparty + emailpassword recipe = thirdparty, emailpassword first factors
// all_auth recipe = emailpassword, thirdparty, link-email, link-phone first factors
// thirdparty + passwordless recipe = thirdparty, link-email and link-phone first factors
// multifactorauth recipe =

export type UserFlags = UserFlagsRaw & { manager: NonNullable<UserFlagsRaw["manager"]> };

export type ExecOutput = {
    code: number | null;
    error: string | undefined;
};

export type AnalyticsEvent =
    | {
          eventName: "cli_started";
      }
    | {
          eventName: "cli_completed";
          frontend?: string;
          backend?: string;
      }
    | {
          eventName: "cli_selection_complete";
          frontend?: string;
          backend?: string;
      }
    | {
          eventName: "cli_failed";
          frontend?: string;
          backend?: string;
          error: string;
      };

export type AnalyticsEventWithCommonProperties = AnalyticsEvent & {
    userId: string;
    os: string;
    cliversion: string;
};

export type FirstFactor =
    | "emailpassword"
    | "thirdparty"
    | "otp-phone"
    | "otp-email"
    | "link-phone"
    | "link-email"
    | "webauthn";
export type SecondFactor = "otp-phone" | "otp-email" | "link-phone" | "link-email" | "totp";

export type FactorConfig = {
    firstFactors?: FirstFactor[];
    secondFactors?: SecondFactor[];
    contactMethodEmailOrPhone?: boolean;
    contactMethodPhone?: boolean;
    contactMethodEmail?: boolean;
};

export type RecipeToFactorMapping = {
    all_auth: FirstFactor[];
    emailpassword: FirstFactor[];
    thirdpartyemailpassword: FirstFactor[];
    passwordless: FirstFactor[];
    thirdpartypasswordless: FirstFactor[];
    thirdparty: FirstFactor[];
    webauthn: FirstFactor[];
    multitenancy: {
        firstFactors: FirstFactor[];
        secondFactors?: SecondFactor[];
    }[];
    multifactorauth: {
        firstFactors: FirstFactor[];
        secondFactors: SecondFactor[];
    };
};

export const RECIPE_TO_FACTOR_MAPPING: RecipeToFactorMapping = {
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

export const getFactorsFromRecipes = (recipes: Recipe[]): FactorConfig => {
    const firstFactors: FirstFactor[] = [];
    const secondFactors: SecondFactor[] = [];
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

export const getRecipesFromFactors = (config: FactorConfig): Recipe[] => {
    const recipes: Recipe[] = [];

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
