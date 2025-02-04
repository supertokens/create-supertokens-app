package main

import (
	"net/http"
	"strings"

	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/supertokens"
)

func main() {
	err := supertokens.Init(SuperTokensConfig)

	if err != nil {
		panic(err.Error())
	}

	http.ListenAndServe(":3001", corsMiddleware(
		supertokens.Middleware(http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
			// Handle your APIs..
			path := strings.TrimSuffix(r.URL.Path, "/")

			// A public endpoint unprotected by SuperTokens
			if path == "/hello" && r.Method == "GET" {
				hello(rw, r)
				return
			}

			// A SuperTokens protected endpoint that returns
			// session information
			if path == "/sessioninfo" {
				session.VerifySession(nil, sessioninfo).ServeHTTP(rw, r)
				return
			}

			// An endpoint that returns tenant lists in a
			// multitenant configuration
			if path == "/tenants" && r.Method == "GET" {
				tenants(rw, r)
				return
			}

			rw.WriteHeader(404)
		}))))
} 