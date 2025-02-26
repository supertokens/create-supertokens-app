import { generateTypeScriptTemplate } from "../../../boilerplate/backend/shared/typescript/ts";
import { generatePythonTemplate } from "../../../boilerplate/backend/shared/python/py";
import { generateGoTemplate } from "../../../boilerplate/backend/shared/go/go";
import { generateReactTemplate } from "../../../boilerplate/frontend/shared/react/template";
import { generateWebJSTemplate } from "../../../boilerplate/frontend/shared/web-js/template";
// Flag for first-factors
export const compileBackend = ({ language, configType }) => {
    switch (language) {
        case "ts":
            return generateTypeScriptTemplate(configType);
        case "py":
            return generatePythonTemplate(configType);
        case "go":
            return generateGoTemplate(configType);
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
};
export const compileFrontend = ({ framework, configType }) => {
    if (framework === "react") {
        return generateReactTemplate(configType);
    }
    // All other frameworks (vue, angular, solid) use the web-js template
    return generateWebJSTemplate(configType, framework);
};
// Compile fullstack templates by leveraging existing frontend and backend generators
// This unifies the approach for all template types (frontend, backend, and fullstack)
export const compileFullstack = ({ framework, configType, component }) => {
    // For backend component of fullstack apps
    if (component === "backend") {
        // Most fullstack frameworks use TypeScript for backend
        // But we can extend this with language detection if needed
        return generateTypeScriptTemplate(configType, framework, true);
    }
    // For frontend component of fullstack apps
    if (component === "frontend") {
        // Map fullstack frameworks to their base frontend frameworks
        if (framework.includes("next") || framework.includes("remix")) {
            // Next.js and Remix use React
            // Pass the framework name to handle environment variables correctly
            return generateReactTemplate(configType, framework, true);
        }
        if (framework.includes("nuxt")) {
            // Nuxt uses Vue
            return generateWebJSTemplate(configType, "vue", true);
        }
        if (framework.includes("sveltekit")) {
            // SvelteKit uses the web-js template with Svelte
            return generateWebJSTemplate(configType, "svelte", true);
        }
        if (framework.includes("astro")) {
            if (framework.includes("react")) {
                // Astro with React components
                return generateReactTemplate(configType, framework, true);
            }
            // Vanilla Astro
            return generateWebJSTemplate(configType, "astro", true);
        }
        // Default to web-js template for unknown frameworks
        return generateWebJSTemplate(configType, framework, true);
    }
    throw new Error(`Invalid component type: ${component}. Must be 'frontend' or 'backend'`);
};
// If special treatment required
// export const compileFullStack
