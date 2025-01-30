import { TypeInput } from "supertokens-node/types";

export interface BaseConfig {
    apiPort?: string;
    apiUrl?: string;
    websitePort?: string;
    websiteUrl?: string;
    appName?: string;
}

export function getApiDomain(config?: BaseConfig): string {
    const apiPort = process.env.VITE_APP_API_PORT ?? config?.apiPort ?? "3001";
    return process.env.VITE_APP_API_URL ?? config?.apiUrl ?? `http://localhost:${apiPort}`;
}

export function getWebsiteDomain(config?: BaseConfig): string {
    const websitePort = process.env.VITE_APP_WEBSITE_PORT ?? config?.websitePort ?? "3000";
    return process.env.VITE_APP_WEBSITE_URL ?? config?.websiteUrl ?? `http://localhost:${websitePort}`;
}

export const defaultAppInfo = {
    appName: "SuperTokens Demo App",
    apiDomain: getApiDomain(),
    websiteDomain: getWebsiteDomain(),
} as const;

export const defaultSupertokensConfig = {
    connectionURI: "https://try.supertokens.com",
} as const;

export const defaultOAuthProviders = {
    google: {
        clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
        clientSecret: "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",
    },
    github: {
        clientId: "467101b197249757c71f",
        clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd",
    },
    apple: {
        clientId: "4398792-io.supertokens.example.service",
        additionalConfig: {
            keyId: "7M48Y4RYDL",
            privateKey:
                "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
            teamId: "YWQCXGJRJL",
        },
    },
    twitter: {
        clientId: "4398792-WXpqVXRiazdRMGNJdEZIa3RVQXc6MTpjaQ",
        clientSecret: "BivMbtwmcygbRLNQ0zk45yxvW246tnYnTFFq-LH39NwZMxFpdC",
    },
};
