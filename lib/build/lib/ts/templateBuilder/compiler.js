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
// If special treatment required
// export const compileFullStack
