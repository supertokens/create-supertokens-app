import { ConfigType, Language } from "./types";
import { generateTypeScriptTemplate } from "../../../boilerplate/backend/shared/typescript/ts";
import { generatePythonTemplate } from "../../../boilerplate/backend/shared/python/py";
import { generateGoTemplate } from "../../../boilerplate/backend/shared/go/go";

interface CompilerOptions {
    language: Language;
    configType: ConfigType;
}

export const compile = ({ language, configType }: CompilerOptions): string => {
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
