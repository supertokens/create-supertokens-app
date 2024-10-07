import { Answers, IPromptFilterStrategy, PromptListChoice, UIBuildType, UserFlagsRaw } from "./types.js";

const getIsValueSupported = (value: string, supportedValues: string[]) => {
    return supportedValues.includes(value);
};

const filterFrontendByUiType: IPromptFilterStrategy = {
    validValues: ["react"],
    filterChoices(choices, answers) {
        if (answers.ui === UIBuildType.PRE_BUILT) {
            return choices;
        }
        return choices.filter((choice) => getIsValueSupported(choice.value, this.validValues));
    },
    validateUserArguments(userArguments) {
        if (!userArguments.frontend) return true;
        return (
            userArguments.ui === UIBuildType.PRE_BUILT || getIsValueSupported(userArguments.frontend, this.validValues)
        );
    },
};

const filterRecipeByUiType: IPromptFilterStrategy = {
    validValues: ["emailpassword", "thirdpartyemailpassword"],
    filterChoices(choices, answers) {
        if (answers.ui === UIBuildType.PRE_BUILT) {
            return choices;
        }
        return choices.filter((choice) => getIsValueSupported(choice.value, this.validValues));
    },
    validateUserArguments(userArguments) {
        if (!userArguments.recipe) return true;
        return (
            userArguments.ui === UIBuildType.PRE_BUILT || getIsValueSupported(userArguments.recipe, this.validValues)
        );
    },
};

export const FILTER_CHOICES_STRATEGY = {
    filterFrontendByUiType,
    filterRecipeByUiType,
};

/**
 * Filters a list of choices based on the provided strategy or strategies.
 *
 * @param choices - An array of `PromptListChoice` objects or a promise that resolves to such an array.
 * @param answers - An object containing the answers to previous prompts.
 * @param strategy - An optional filtering strategy or an array of strategies. This can be one of the predefined
 *                   `FILTER_CHOICES_STRATEGY` values, an array of such values, or a custom function that takes an
 *                   array of choices and returns a promise that resolves to a filtered array of choices.
 * @returns A promise that resolves to the filtered array of `PromptListChoice` objects.
 */
export const filterChoices = async (
    choices: PromptListChoice[] | Promise<PromptListChoice[]>,
    answers: Answers,
    strategy?:
        | IPromptFilterStrategy
        | IPromptFilterStrategy[]
        | ((choices: PromptListChoice[]) => Promise<PromptListChoice[]>)
): Promise<PromptListChoice[]> => {
    if (choices instanceof Promise) {
        choices = await choices;
    }
    if (!strategy || (Array.isArray(strategy) && strategy.length === 0)) {
        return choices;
    }
    if (typeof strategy === "function") {
        return strategy(choices);
    }
    if (!Array.isArray(strategy)) {
        strategy = [strategy];
    }
    for (const filter of strategy) {
        choices = filter.filterChoices(choices, answers);
    }
    return choices;
};

export const validateUserArgumentsByFilterStrategy = (
    userArguments: UserFlagsRaw,
    argumentToValidateKey: keyof UserFlagsRaw,
    strategy?: IPromptFilterStrategy | IPromptFilterStrategy[]
): boolean => {
    if (!strategy) {
        return true;
    }
    if (!Array.isArray(strategy)) {
        strategy = [strategy];
    }
    if (!userArguments?.[argumentToValidateKey]) {
        throw new Error(`Invalid ${argumentToValidateKey} provided`);
    }

    for (const filter of strategy) {
        if (!filter.validateUserArguments(userArguments)) {
            return false;
        }
    }
    return true;
};

export const isValidUiBasedOnFilters = (userArguments: UserFlagsRaw): boolean => {
    if (!userArguments.ui) return true;
    if (!Object.values(UIBuildType).includes(userArguments.ui)) return false;
    if (userArguments.ui === UIBuildType.PRE_BUILT) return true;
    return validateUserArgumentsByFilterStrategy(userArguments, "ui", [
        FILTER_CHOICES_STRATEGY.filterFrontendByUiType,
        FILTER_CHOICES_STRATEGY.filterRecipeByUiType,
    ]);
};
