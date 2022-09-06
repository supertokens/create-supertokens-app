import os

from flask import Flask, abort, g, jsonify
from flask_cors import CORS
from supertokens_python import (
    InputAppInfo,
    SupertokensConfig,
    get_all_cors_headers,
    init,
)
from supertokens_python.framework.flask import Middleware
from supertokens_python.recipe.session.framework.flask import verify_session
import config


def get_api_port():
    return "3001"


def get_website_port():
    return "3000"


def get_website_domain():
    return "http://localhost:" + get_website_port()


init(
    supertokens_config=SupertokensConfig(connection_uri="https://try.supertokens.io"),
    app_info=InputAppInfo(
        app_name="Supertokens",
        api_domain="http://localhost:" + get_api_port(),
        website_domain=get_website_domain(),
    ),
    framework="flask",
    recipe_list=config.recipe_list,
    telemetry=False,
)

app = Flask(__name__)
# TODO: should middlware be after or before cors?
Middleware(app)
CORS(
    app=app,
    supports_credentials=True,
    origins=get_website_domain(),
    allow_headers=["Content-Type"] + get_all_cors_headers(),
)


@app.route("/sessioninfo", methods=["GET"])  # type: ignore
@verify_session()
def get_session_info():
    session_ = g.supertokens
    return jsonify(
        {
            "sessionHandle": session_.get_handle(),
            "userId": session_.get_user_id(),
            "accessTokenPayload": session_.get_access_token_payload(),
        }
    )


# This is required since if this is not there, then OPTIONS requests for
# the APIs exposed by the supertokens' Middleware will return a 404
@app.route("/", defaults={"u_path": ""})  # type: ignore
@app.route("/<path:u_path>")  # type: ignore
def catch_all(u_path: str):  # pylint: disable=unused-argument
    abort(404)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(get_api_port()), debug=True)
