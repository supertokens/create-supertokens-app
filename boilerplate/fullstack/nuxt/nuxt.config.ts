// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    srcDir: ".",
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    typescript: {
        typeCheck: true,
    },
    plugins: ["~/plugins/supertokens.client.ts"],
    css: ["~/assets/main.css"],
});
