import os
from typing import Optional, Dict, Any
from dataclasses import dataclass

@dataclass
class BaseConfig:
    api_port: Optional[int] = None
    api_url: Optional[str] = None
    website_port: Optional[int] = None
    website_url: Optional[str] = None
    app_name: Optional[str] = None

def get_api_domain(config: Optional[BaseConfig] = None) -> str:
    api_port = os.environ.get("VITE_APP_API_PORT") or getattr(config, "api_port", None) or 3001
    api_url = os.environ.get("VITE_APP_API_URL") or getattr(config, "api_url", None) or f"http://localhost:{api_port}"
    return api_url

def get_website_domain(config: Optional[BaseConfig] = None) -> str:
    website_port = os.environ.get("VITE_APP_WEBSITE_PORT") or getattr(config, "website_port", None) or 3000
    website_url = os.environ.get("VITE_APP_WEBSITE_URL") or getattr(config, "website_url", None) or f"http://localhost:{website_port}"
    return website_url

default_app_info = {
    "app_name": "Supertokens",
    "api_domain": get_api_domain(),
    "website_domain": get_website_domain(),
}

default_supertokens_config = {
    "connection_uri": "https://try.supertokens.com"
}

default_oauth_providers = {
    "google": {
        "client_id": "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
        "client_secret": "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",
    },
    "github": {
        "client_id": "467101b197249757c71f",
        "client_secret": "e97051221f4b6426e8fe8d51486396703012f5bd",
    },
    "apple": {
        "client_id": "4398792-io.supertokens.example.service",
        "additional_config": {
            "key_id": "7M48Y4RYDL",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
            "team_id": "YWQCXGJRJL",
        },
    },
    "twitter": {
        "client_id": "4398792-WXpqVXRiazdRMGNJdEZIa3RVQXc6MTpjaQ",
        "client_secret": "BivMbtwmcygbRLNQ0zk45yxvW246tnYnTFFq-LH39NwZMxFpdC",
    },
} 