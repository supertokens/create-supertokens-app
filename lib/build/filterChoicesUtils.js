import { allFrontends, UIBuildType } from "./types.js";
const getIsValueSupported = (value, supportedValues) => {
    return supportedValues.includes(value);
};
/**
 * Frontend filter strategy based on the selected UI build type.
 */
/**
 * Strategy for filtering frontend choices based on the UI build type.
 *
 * @implements {IPromptFilterStrategy}
 *
 * @property {function} filterChoices - Filters the available choices based on the selected UI build type.
 * @param {Array} choices - The list of available choices.
 * @param {Object} answers - The answers provided by the user.
 * @returns {Array} - The filtered list of choices.
 *
 * @property {function} validateUserArguments - Validates the user-provided arguments based on the UI build type.
 * @param {Object} userArguments - The arguments provided by the user.
 * @returns {boolean} - Returns true if the user arguments are valid, otherwise false.
 */
const filterFrontendByUiType = {
    filterChoices(choices, answers) {
        /**
         * For pre-built UI
         */
        if (answers.ui === UIBuildType.PRE_BUILT) {
            const prebuiltUiSupportedFrontends = getSupportedFrontendForUI(UIBuildType.PRE_BUILT);
            return choices.filter((choice) => getIsValueSupported(choice.value, prebuiltUiSupportedFrontends));
        }
        /**
         * For custom UI
         */
        const customUiSupportedFrontends = getSupportedFrontendForUI(UIBuildType.CUSTOM);
        return choices.filter((choice) => getIsValueSupported(choice.value, customUiSupportedFrontends));
    },
    validateUserArguments(userArguments) {
        /**
         * For pre-built UI
         */
        const prebuiltUiSupportedFrontends = getSupportedFrontendForUI(UIBuildType.PRE_BUILT);
        if (
            !userArguments.frontend ||
            (userArguments.ui === UIBuildType.PRE_BUILT &&
                getIsValueSupported(userArguments.frontend, prebuiltUiSupportedFrontends))
        ) {
            return true;
        }
        /**
         * For custom UI
         */
        const customUiSupportedFrontends = getSupportedFrontendForUI(UIBuildType.CUSTOM);
        return getIsValueSupported(userArguments.frontend, customUiSupportedFrontends);
    },
};
/**
 * Recipe filter strategy based on the selected UI build type.
 */
const filterRecipeByUiType = {
    filterChoices(choices, answers) {
        /**
         * For pre-built UI
         */
        const prebuiltUiSupportedRecipes = getSupportedRecipeForUI(UIBuildType.PRE_BUILT);
        if (answers.ui === UIBuildType.PRE_BUILT) {
            return choices.filter((choice) => getIsValueSupported(choice.value, prebuiltUiSupportedRecipes));
        }
        /**
         * For custom UI
         */
        const customUiSupportedRecipes = getSupportedRecipeForUI(UIBuildType.CUSTOM);
        return choices.filter((choice) => getIsValueSupported(choice.value, customUiSupportedRecipes));
    },
    validateUserArguments(userArguments) {
        /**
         * For pre-built UI
         */
        const prebuiltUiSupportedRecipes = getSupportedRecipeForUI(UIBuildType.PRE_BUILT);
        if (
            !userArguments.recipe ||
            (userArguments.ui === UIBuildType.PRE_BUILT &&
                getIsValueSupported(userArguments.recipe, prebuiltUiSupportedRecipes))
        )
            return true;
        /**
         * For custom UI
         */
        const customUiSupportedRecipes = getSupportedRecipeForUI(UIBuildType.CUSTOM);
        return getIsValueSupported(userArguments.recipe, customUiSupportedRecipes);
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
/**
 * Retrieves the supported frontend frameworks for a given UI build type.
 *
 * @param {UIBuildType} ui - The type of UI build.
 * @returns {SupportedFrontends[]} An array of supported frontend frameworks for the given UI.
 */
const getSupportedFrontendForUI = (ui) => {
    const CUSTOM_ONLY = ["react-custom"];
    if (ui === UIBuildType.PRE_BUILT) {
        // Return all frontends except the custom only ones
        return allFrontends.map((frontend) => frontend.id).filter((frontend) => !CUSTOM_ONLY.includes(frontend));
    }
    return CUSTOM_ONLY;
};
/**
 * Retrieves the list of supported recipes for the given UI build type.
 *
 * @param {UIBuildType} ui - The type of UI build (e.g., PRE_BUILT or CUSTOM).
 * @returns {string[]} An array of supported recipe names for the given UI Build type.
 */
const getSupportedRecipeForUI = (ui) => {
    const CUSTOM_SUPPORTED_RECIPES = [
        "emailpassword",
        "thirdparty",
        "passwordless",
        "thirdpartypasswordless",
        "thirdpartyemailpassword",
    ];
    const PREBUILT_SUPPORTED_RECIPES = [...CUSTOM_SUPPORTED_RECIPES, "all_auth", "multitenancy", "multifactorauth"];
    return ui === UIBuildType.PRE_BUILT ? PREBUILT_SUPPORTED_RECIPES : CUSTOM_SUPPORTED_RECIPES;
};
