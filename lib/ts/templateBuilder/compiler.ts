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
    framework?: string; // Added framework (optional, as not all backends need it passed down)
}

interface FrontendCompilerOptions {
    framework: FrontendFramework;
    configType: ConfigType;
    userArguments: UserFlags;
}

interface FullstackCompilerOptions {
    framework: string; // Use string type for broader framework support
    configType: ConfigType;
    component: "frontend" | "backend"; // To differentiate between frontend and backend parts
    userArguments: UserFlags;
}
// Flag for first-factors  - paswordless, as input via flags

export const compileBackend = ({ language, configType, userArguments, framework }: BackendCompilerOptions): string => {
    // Added framework
    // Removed Go MFA check from here, handled in switch case

    switch (language) {
        case "ts":
            // Pass framework as the second argument
            return generateTypeScriptTemplate({ configType, userArguments }, framework);
        case "py":
            // Pass framework for dynamic init call in Python template
            return generatePythonTemplate({ configType, userArguments, framework });
        case "go": {
            // Added block scope for clarity
            // Adjust configType for Go MFA incompatibility
            let goConfigType = configType;
            if (goConfigType === "multifactorauth") {
                goConfigType = "thirdpartyemailpassword"; // Fallback
            }
            // Filter out MFA factors for Go
            const goUserArgs = { ...userArguments };
            delete goUserArgs.secondfactors;
            // Pass adjusted configType and filtered args
            return generateGoTemplate({ configType: goConfigType, userArguments: goUserArgs });
        } // End of Go case block
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
};

export const compileFrontend = ({ framework, configType, userArguments }: FrontendCompilerOptions): string => {
    if (framework === "react") {
        return generateReactTemplate({ configType, userArguments });
    }
    // All other frameworks (vue, angular, solid) use the web-js template
    return generateWebJSTemplate({ configType, userArguments });
};

// Compile fullstack templates by leveraging existing frontend and backend generators
// This unifies the approach for all template types (frontend, backend, and fullstack)
export const compileFullstack = ({
    framework,
    configType,
    component,
    userArguments,
}: FullstackCompilerOptions): string => {
    // For backend component of fullstack apps
    if (component === "backend") {
        // Most fullstack frameworks use TypeScript for backend
        // But we can extend this with language detection if needed
        // Call generateTypeScriptTemplate, passing isFullStack flag
        return generateTypeScriptTemplate(
            {
                configType,
                userArguments,
                isFullStack: true, // Indicate this is for a fullstack context
            },
            framework // Pass fullstack framework name as the framework context
        );
    }

    // For frontend component of fullstack apps
    if (component === "frontend") {
        // Map fullstack frameworks to their base frontend frameworks
        if (framework.includes("next") || framework.includes("remix")) {
            // Next.js and Remix use React
            // Pass the framework name to handle environment variables correctly
            return generateReactTemplate({ configType, userArguments, isFullStack: true });
        }

        if (framework.includes("nuxt")) {
            // Nuxt uses Vue
            return generateWebJSTemplate({ configType, isFullStack: true, userArguments });
        }

        if (framework.includes("sveltekit")) {
            // SvelteKit uses the web-js template with Svelte
            return generateWebJSTemplate({ configType, isFullStack: true, userArguments });
        }

        if (framework.includes("astro")) {
            if (framework.includes("react")) {
                // Astro with React components
                return generateReactTemplate({ configType, userArguments, isFullStack: true });
            }
            // Vanilla Astro
            return generateWebJSTemplate({ configType, isFullStack: true, userArguments });
        }

        // Default to web-js template for unknown frameworks
        return generateWebJSTemplate({ configType, isFullStack: true, userArguments });
    }

    throw new Error(`Invalid component type: ${component}. Must be 'frontend' or 'backend'`);
};
