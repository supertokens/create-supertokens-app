export type Recipe =
    | "emailpassword"
    | "thirdpartyemailpassword"
    | "passwordless"
    | "thirdpartypasswordless"
    | "thirdparty";

export const allRecipes: Recipe[] = [
    "emailpassword",
    "thirdpartyemailpassword",
    "passwordless",
    "thirdpartypasswordless",
    "thirdparty",
];

export function isValidRecipeName(recipe: string): recipe is Recipe {
    if (allRecipes.includes(recipe as Recipe)) {
        return true;
    }

    return false;
}

export type SupportedFrontends = "react" | "next" | "angular-prebuilt" | "vue-prebuilt";

export const allFrontends: {
    displayValue: string;
    id: SupportedFrontends;
}[] = [
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

export function isValidFrontend(frontend: string): frontend is SupportedFrontends {
    if (allFrontends.filter((i) => i.displayValue === frontend).length !== 0) {
        return true;
    }

    return false;
}

export type SupportedBackends = "node" | "nest" | "python-flask" | "go-http";

export const allBackends: {
    displayValue: string;
    id: SupportedBackends;
}[] = [
    {
        id: "node",
        displayValue: "node",
    },
    {
        id: "nest",
        displayValue: "nest",
    },
    {
        id: "python-flask",
        displayValue: "python",
    },
    {
        id: "go-http",
        displayValue: "golang",
    },
];

export function isValidBackend(backend: string): backend is SupportedBackends {
    if (allBackends.filter((i) => i.displayValue === backend).length !== 0) {
        return true;
    }

    return false;
}

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
 *  - configFiles: The path where all the recipe configs are (This should be a folder because the recipe name will pre post fixed when loading the config)
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
          location: {
              main: string;
              finalConfig: string;
              configFiles: string;
          };
      }
    | {
          isFullStack: true;
          location: {
              main: string;
              config: {
                  frontend: {
                      configFiles: string;
                      finalConfig: string;
                  };
                  backend: {
                      configFiles: string;
                      finalConfig: string;
                  };
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
    frontend: SupportedFrontends;
    backend: SupportedBackends;
    recipe: string;
    appname: string;
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
};

export type SupportedPackageManagers = "npm" | "yarn";

export const allPackageManagers: SupportedPackageManagers[] = ["npm", "yarn"];

export function isValidPackageManager(manager: string): manager is SupportedPackageManagers {
    if (allPackageManagers.includes(manager as SupportedPackageManagers)) {
        return true;
    }

    return false;
}

export type UserFlags = {
    appname?: string;
    recipe?: string;
    branch?: string;
    frontend?: SupportedFrontends;
    backend?: SupportedBackends;
    manager?: SupportedPackageManagers;
    autostart?: string | boolean;
};

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
          frontend: string;
          backend: string;
      }
    | {
          eventName: "cli_failed";
          frontend: string;
          backend: string;
      };

export type AnalyticsEventWithCommonProperties = AnalyticsEvent & {
    userId: string;
    os: string;
    // timestamp: number; // added from the backend
    // ip: string // stored in the backend
};
