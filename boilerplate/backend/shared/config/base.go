package config

import (
	"fmt"
	"os"
)

// BaseConfig holds the common configuration options
type BaseConfig struct {
	ApiPort     string
	ApiUrl      string
	WebsitePort string
	WebsiteUrl  string
	AppName     string
}

// GetApiDomain returns the API domain based on config or environment variables
func GetApiDomain(config *BaseConfig) string {
	apiPort := os.Getenv("VITE_APP_API_PORT")
	if apiPort == "" {
		if config != nil && config.ApiPort != "" {
			apiPort = config.ApiPort
		} else {
			apiPort = "3001"
		}
	}

	apiUrl := os.Getenv("VITE_APP_API_URL")
	if apiUrl == "" {
		if config != nil && config.ApiUrl != "" {
			apiUrl = config.ApiUrl
		} else {
			apiUrl = fmt.Sprintf("http://localhost:%s", apiPort)
		}
	}
	return apiUrl
}

// GetWebsiteDomain returns the website domain based on config or environment variables
func GetWebsiteDomain(config *BaseConfig) string {
	websitePort := os.Getenv("VITE_APP_WEBSITE_PORT")
	if websitePort == "" {
		if config != nil && config.WebsitePort != "" {
			websitePort = config.WebsitePort
		} else {
			websitePort = "3000"
		}
	}

	websiteUrl := os.Getenv("VITE_APP_WEBSITE_URL")
	if websiteUrl == "" {
		if config != nil && config.WebsiteUrl != "" {
			websiteUrl = config.WebsiteUrl
		} else {
			websiteUrl = fmt.Sprintf("http://localhost:%s", websitePort)
		}
	}
	return websiteUrl
}

// GetStringPointer returns a pointer to the given string
func GetStringPointer(s string) *string {
	return &s
}

// GetBoolPointer returns a pointer to the given bool
func GetBoolPointer(b bool) *bool {
	return &b
}

// DefaultAppInfo contains default application information
var DefaultAppInfo = map[string]string{
	"appName":       "SuperTokens Demo App",
	"apiDomain":     GetApiDomain(nil),
	"websiteDomain": GetWebsiteDomain(nil),
}

// DefaultSupertokensConfig contains default SuperTokens configuration
var DefaultSupertokensConfig = map[string]string{
	"connectionURI": "https://try.supertokens.com",
}

// OAuthProviderConfig holds OAuth provider configuration
type OAuthProviderConfig struct {
	ClientID     string                 `json:"clientId"`
	ClientSecret string                 `json:"clientSecret"`
	Additional   map[string]interface{} `json:"additionalConfig,omitempty"`
}

// DefaultOAuthProviders contains default OAuth provider configurations
var DefaultOAuthProviders = map[string]OAuthProviderConfig{
	"google": {
		ClientID:     "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
		ClientSecret: "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",
	},
	"github": {
		ClientID:     "467101b197249757c71f",
		ClientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd",
	},
	"apple": {
		ClientID: "4398792-io.supertokens.example.service",
		Additional: map[string]interface{}{
			"keyId":      "7M48Y4RYDL",
			"privateKey": "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
			"teamId":     "YWQCXGJRJL",
		},
	},
	"twitter": {
		ClientID:     "4398792-WXpqVXRiazdRMGNJdEZIa3RVQXc6MTpjaQ",
		ClientSecret: "BivMbtwmcygbRLNQ0zk45yxvW246tnYnTFFq-LH39NwZMxFpdC",
	},
} 