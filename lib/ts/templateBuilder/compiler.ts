import { ConfigType, FrontendFramework, Language } from "./types";
import { UserFlags } from "../types";
import { generateTypeScriptTemplate } from "../../../boilerplate/backend/shared/typescript/ts";
import { generatePythonTemplate } from "../../../boilerplate/backend/shared/python/py";
import { generateGoTemplate } from "../../../boilerplate/backend/shared/go/go";
import { generateReactTemplate } from "../../../boilerplate/frontend/shared/react/template";
import { generateWebJSTemplate } from "../../../boilerplate/frontend/shared/web-js/template";

interface BackendCompilerOptions {
    language: Language;
    configType: ConfigType;
    userArguments: UserFlags;
    framework?: string;
}

interface FrontendCompilerOptions {
    framework: FrontendFramework;
    configType: ConfigType;
    userArguments: UserFlags;
}

interface FullstackCompilerOptions {
    framework: string;
    configType: ConfigType;
    component: "frontend" | "backend";
    userArguments: UserFlags;
}

export const compileBackend = ({ language, configType, userArguments, framework }: BackendCompilerOptions): string => {
    switch (language) {
        case "ts":
            return generateTypeScriptTemplate({ configType, userArguments }, framework);
        case "py":
            return generatePythonTemplate({ configType, userArguments, framework });
        case "go": {
            let goConfigType = configType;
            if (goConfigType === "multifactorauth") {
                goConfigType = "thirdpartyemailpassword"; // Fallback
            }
            const goUserArgs = { ...userArguments };
            delete goUserArgs.secondfactors;
            return generateGoTemplate({ configType: goConfigType, userArguments: goUserArgs });
        }
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
};

export const compileFrontend = ({ framework, configType, userArguments }: FrontendCompilerOptions): string => {
    if (framework === "react") {
        return generateReactTemplate({ configType, userArguments });
    }
    return generateWebJSTemplate({ configType, userArguments });
};

export const compileFullstack = ({
    framework,
    configType,
    component,
    userArguments,
}: FullstackCompilerOptions): string => {
    if (component === "backend") {
        return generateTypeScriptTemplate(
            {
                configType,
                userArguments,
                isFullStack: true,
            },
            framework
        );
    }

    if (component === "frontend") {
        if (framework.includes("next") || framework.includes("remix")) {
            return generateReactTemplate({ configType, userArguments, isFullStack: true });
        }

        if (framework.includes("nuxt")) {
            return generateWebJSTemplate({ configType, isFullStack: true, userArguments });
        }

        if (framework.includes("sveltekit")) {
            return generateWebJSTemplate({ configType, isFullStack: true, userArguments });
        }

        if (framework.includes("astro")) {
            if (framework.includes("react")) {
                return generateReactTemplate({ configType, userArguments, isFullStack: true });
            }
            return generateWebJSTemplate({ configType, isFullStack: true, userArguments });
        }

        return generateWebJSTemplate({ configType, isFullStack: true, userArguments });
    }

    throw new Error(`Invalid component type: ${component}. Must be 'frontend' or 'backend'`);
};
