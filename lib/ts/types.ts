export type Recipe =
    | "all_auth"
    | "emailpassword"
    | "thirdpartyemailpassword"
    | "passwordless"
    | "thirdpartypasswordless"
    | "thirdparty"
    | "multitenancy"
    | "multifactorauth";

export const allRecipes: Recipe[] = [
    "all_auth",
    "emailpassword",
    "thirdpartyemailpassword",
    "passwordless",
    "thirdpartypasswordless",
    "thirdparty",
    "multitenancy",
    "multifactorauth",
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
    | "sveltekit"
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

export function isValidFrontend(frontend: string): frontend is SupportedFrontends {
    if (allFrontends.filter((i) => i.id === frontend).length !== 0) {
        return true;
    }

    return false;
}

type PythonFrameworks = "python-flask" | "python-drf" | "python-fastapi";
type NodeJSFrameworks = "koa" | "express" | "nest";

export type SupportedBackends = "nodejs" | "python" | NodeJSFrameworks | PythonFrameworks | "go-http";

export const allBackends: {
    id: SupportedBackends;
}[] = [
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

export function isValidBackend(backend: string): backend is SupportedBackends {
    if (allBackends.filter((i) => i.id === backend).length !== 0) {
        return true;
    }

    return false;
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
};

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
