import os
from typing import Optional, Dict, Any
from dataclasses import dataclass

from supertokens_python import InputAppInfo, SupertokensConfig
from supertokens_python.recipe.multitenancy.interfaces import TenantConfig
from supertokens_python.recipe import session
from supertokens_python.framework import BaseRequest, BaseResponse

@dataclass
class BaseConfig:
    api_port: Optional[str] = None
    api_url: Optional[str] = None
    website_port: Optional[str] = None
    website_url: Optional[str] = None
    app_name: Optional[str] = None

def get_api_domain(config: Optional[BaseConfig] = None) -> str:
    api_port = os.environ.get("VITE_APP_API_PORT") or getattr(config, "api_port", "3001")
    return os.environ.get("VITE_APP_API_URL") or getattr(config, "api_url", None) or f"http://localhost:{api_port}"

def get_website_domain(config: Optional[BaseConfig] = None) -> str:
    website_port = os.environ.get("VITE_APP_WEBSITE_PORT") or getattr(config, "website_port", "3000")
    return os.environ.get("VITE_APP_WEBSITE_URL") or getattr(config, "website_url", None) or f"http://localhost:{website_port}"

# Core configuration with modern features
default_supertokens_config = SupertokensConfig(
    connection_uri=os.environ.get("SUPERTOKENS_CONNECTION_URI", "https://try.supertokens.com"),
    api_key=os.environ.get("SUPERTOKENS_API_KEY"),
    network_info=SupertokensConfig.NetworkInfo(
        request_timeout=10000,  # 10 seconds
        max_retries=5
    )
)

# Application information with proper typing
default_app_info = InputAppInfo(
    app_name="SuperTokens Demo App",
    api_domain=get_api_domain(),
    website_domain=get_website_domain(),
    api_base_path="/auth",
    website_base_path="/auth"
)

# Session configuration with security features
default_session_config = session.SessionConfig(
    cookie_domain=None,  # Automatically determined
    cookie_secure=True,
    cookie_same_site="lax",
    session_expired_status_code=440,
    anti_csrf="VIA_TOKEN",
    get_token_transfer_method=lambda _, __, ___: "header"
)

# Default CORS configuration
default_cors_config = {
    "allow_credentials": True,
    "allow_origins": ["http://localhost:3000"],
    "allow_methods": ["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
    "allow_headers": ["Content-Type", "anti-csrf"],
    "max_age": 86400  # 24 hours
}

# OAuth provider configuration with proper environment variable support
default_oauth_providers = {
    "google": {
        "client_id": os.environ.get(
            "GOOGLE_CLIENT_ID",
            "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com"
        ),
        "client_secret": os.environ.get(
            "GOOGLE_CLIENT_SECRET",
            "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"
        ),
    },
    "github": {
        "client_id": os.environ.get(
            "GITHUB_CLIENT_ID",
            "467101b197249757c71f"
        ),
        "client_secret": os.environ.get(
            "GITHUB_CLIENT_SECRET",
            "e97051221f4b6426e8fe8d51486396703012f5bd"
        ),
    },
    "apple": {
        "client_id": os.environ.get(
            "APPLE_CLIENT_ID",
            "4398792-io.supertokens.example.service"
        ),
        "additional_config": {
            "key_id": os.environ.get("APPLE_KEY_ID", "7M48Y4RYDL"),
            "private_key": os.environ.get(
                "APPLE_PRIVATE_KEY",
                "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----"
            ).replace("\\n", "\n"),
            "team_id": os.environ.get("APPLE_TEAM_ID", "YWQCXGJRJL"),
        },
    },
    "twitter": {
        "client_id": os.environ.get(
            "TWITTER_CLIENT_ID",
            "4398792-WXpqVXRiazdRMGNJdEZIa3RVQXc6MTpjaQ"
        ),
        "client_secret": os.environ.get(
            "TWITTER_CLIENT_SECRET",
            "BivMbtwmcygbRLNQ0zk45yxvW246tnYnTFFq-LH39NwZMxFpdC"
        ),
    },
}

# Default rate limiting configuration
default_rate_limit_config = {
    "sign_up": {
        "basis": "ip",
        "max_requests": 10,
        "time_period": 60 * 60  # 1 hour
    },
    "sign_in": {
        "basis": "ip",
        "max_requests": 10,
        "time_period": 60 * 60  # 1 hour
    }
} 