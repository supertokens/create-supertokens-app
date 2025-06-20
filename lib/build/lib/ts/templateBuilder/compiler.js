import { generateTypeScriptTemplate } from "../../../boilerplate/backend/shared/typescript/ts.js";
import { generatePythonTemplate } from "../../../boilerplate/backend/shared/python/py.js";
import { generateGoTemplate } from "../../../boilerplate/backend/shared/go/go.js";
import { generateReactTemplate } from "../../../boilerplate/frontend/shared/react/template.js";
import { generateWebJSTemplate } from "../../../boilerplate/frontend/shared/web-js/template.js";
export const compileBackend = ({ language, configType, userArguments, framework }) => {
    switch (language) {
        case "ts":
            return generateTypeScriptTemplate({ configType, userArguments }, framework);
        case "py": {
            if (configType === "webauthn") {
                throw new Error("The Python SDK does not support webauthn yet. Please use the TypeScript SDK.");
            }
            return generatePythonTemplate({ configType, userArguments, framework });
        }
        case "go": {
            if (configType === "multifactorauth") {
                throw new Error("The Go SDK does not support multifactorauth yet. Please use the TypeScript SDK.");
            }
            if (configType === "webauthn") {
                throw new Error("The Go SDK does not support multitenancy yet. Please use the TypeScript SDK.");
            }
            return generateGoTemplate({ configType: configType, userArguments: userArguments });
        }
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
};
export const compileFrontend = ({ framework, configType, userArguments }) => {
    console.log(framework, configType, userArguments);
    if (framework === "react") {
        return generateReactTemplate({ configType, userArguments });
    }
    return generateWebJSTemplate({ configType, userArguments });
};
export const compileFullstack = ({ framework, configType, component, userArguments }) => {
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
