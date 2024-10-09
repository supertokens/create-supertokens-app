import { SUPPORTED_FRONTEND_FOR_CUSTOM_UI, SUPPORTED_RECIPE_FOR_CUSTOM_UI } from "./constants.js";
import { UIBuildType } from "./types.js";
const getIsValueSupported = (value, supportedValues) => {
    return supportedValues.includes(value);
};
/**
 * Frontend filter strategy based on the selected UI build type.
 */
const filterFrontendByUiType = {
    filterChoices(choices, answers) {
        /**
         * For pre-built UI, all choices are supported which are not part of SUPPORTED_FRONTEND_FOR_CUSTOM_UI.
         */
        if (answers.ui === UIBuildType.PRE_BUILT) {
            return choices.filter((choice) => !getIsValueSupported(choice.value, SUPPORTED_FRONTEND_FOR_CUSTOM_UI));
        }
        /**
         * For custom UI, only a subset of frontend are supported.
         */
        return choices.filter((choice) => getIsValueSupported(choice.value, SUPPORTED_FRONTEND_FOR_CUSTOM_UI));
    },
    validateUserArguments(userArguments) {
        /**
         * If the user has not selected a frontend, then it is valid as the value may be chosen during the inquirer prompt.
         * For pre-built UI, which is the default option all frontend which are not part of SUPPORTED_FRONTEND_FOR_CUSTOM_UI are supported.
         */
        if (
            !userArguments.frontend ||
            (userArguments.ui === UIBuildType.PRE_BUILT &&
                !getIsValueSupported(userArguments.frontend, SUPPORTED_FRONTEND_FOR_CUSTOM_UI))
        ) {
            return true;
        }
        /**
         * For custom UI, only a subset of frontend are supported.
         */
        return getIsValueSupported(userArguments.frontend, SUPPORTED_FRONTEND_FOR_CUSTOM_UI);
    },
};
/**
 * Recipe filter strategy based on the selected UI build type.
 */
const filterRecipeByUiType = {
    filterChoices(choices, answers) {
        /**
         * For pre-built UI, all recipes are supported.
         */
        if (answers.ui === UIBuildType.PRE_BUILT) {
            return choices;
        }
        /**
         * For custom UI, only a subset of recipes are supported.
         */
        return choices.filter((choice) => getIsValueSupported(choice.value, SUPPORTED_RECIPE_FOR_CUSTOM_UI));
    },
    validateUserArguments(userArguments) {
        /**
         * For pre-built UI, which is the default option all existing frontend are supported.
         */
        if (!userArguments.recipe || userArguments.ui === UIBuildType.PRE_BUILT) return true;
        /**
         * For custom UI, only a subset of frontend are supported.
         */
        return getIsValueSupported(userArguments.recipe, SUPPORTED_RECIPE_FOR_CUSTOM_UI);
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
export const filterChoices = async (choices, answers, strategy) => {
    if (!strategy || (Array.isArray(strategy) && strategy.length === 0)) {
        return choices;
    }
    if (!Array.isArray(strategy)) {
        strategy = [strategy];
    }
    for (const filter of strategy) {
        choices = filter.filterChoices(choices, answers);
    }
    return choices;
};
export const validateUserArgumentsByFilterStrategy = (userArguments, argumentToValidateKey, strategy) => {
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
export const isValidUiType = (userArguments) => {
    if (!Object.values(UIBuildType).includes(userArguments.ui)) return false;
    return validateUserArgumentsByFilterStrategy(userArguments, "ui", [
        FILTER_CHOICES_STRATEGY.filterFrontendByUiType,
        FILTER_CHOICES_STRATEGY.filterRecipeByUiType,
    ]);
};