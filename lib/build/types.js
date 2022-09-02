export const allRecipes = [
    "emailpassword",
    "thirdpartyemailpassword",
    "passwordless",
    "thirdpartypasswordless",
];
export function isValidRecipeName(recipe) {
    if (allRecipes.includes(recipe)) {
        return true;
    }
    return false;
}
