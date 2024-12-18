export function getApiDomain() {
    return "";
}

export function getWebsiteDomain() {
    return "";
}

export const styleOverride = `
[data-supertokens~=tenants-link] {
    margin-top: 8px;
}
`;

export const SuperTokensConfig = {
    appInfo: {
        appName: "",
        apiDomain: "",
        websiteDomain: "",
    },
    usesDynamicLoginMethods: true,
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [],
};

export const recipeDetails = {
    docsLink: "",
};

export const PreBuiltUIList = [];
