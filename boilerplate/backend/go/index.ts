import { generateGoTemplate, goMainTemplate } from "../shared/go/go";
import { type ConfigType } from "../../../lib/ts/templateBuilder/types";
import { writeFileSync } from "fs";
import { join } from "path";

export const generateGoBackend = (configType: ConfigType, backendPath: string) => {
    // Generate config.go
    const configTemplate = generateGoTemplate(configType);
    writeFileSync(join(backendPath, "config.go"), configTemplate);

    // Generate main.go with trailing slash handling
    writeFileSync(join(backendPath, "main.go"), goMainTemplate);
};
