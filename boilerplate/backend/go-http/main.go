package main

import (
	"encoding/json"
	"net/http"
	"strings"
	"os"

	"github.com/supertokens/supertokens-golang/recipe/multitenancy"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/supertokens"
)

func main() {
	err := supertokens.Init(SuperTokensConfig)

	if err != nil {
		panic(err.Error())
	}
	port := os.Getenv("VITE_API_PORT")
	if port == "" {
		port = os.Getenv("REACT_APP_API_PORT")
	}
	if port == "" {
		port = "3001"
	}
	
	http.ListenAndServe(":"+port, corsMiddleware(
		supertokens.Middleware(http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
			// Handle your APIs..

			if r.URL.Path == "/sessioninfo" {
				session.VerifySession(nil, sessioninfo).ServeHTTP(rw, r)
				return
			}

			if r.URL.Path == "/tenants" && r.Method == "GET" {
				tenants(rw, r)
				return
			}

			rw.WriteHeader(404)
		}))))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, r *http.Request) {
    allowedOrigins := []string{
			"http://localhost:" + os.Getenv("VITE_APP_PORT"),
			"http://localhost:" + os.Getenv("PORT"),
			"http://localhost:3000", // Default origin
		}
	  origin := r.Header.Get("Origin")
		if origin != "" && contains(allowedOrigins, origin) {
			response.Header().Set("Access-Control-Allow-Origin", origin)
			response.Header().Set("Access-Control-Allow-Credentials", "true")
		} else {
			response.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000") // Default origin
		}

		if r.Method == "OPTIONS" {
			response.Header().Set("Access-Control-Allow-Headers", strings.Join(append([]string{"Content-Type"}, supertokens.GetAllCORSHeaders()...), ","))
			response.Header().Set("Access-Control-Allow-Methods", "*")
			response.Write([]byte(""))
		} else {
			next.ServeHTTP(response, r)
		}
  })
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

func sessioninfo(w http.ResponseWriter, r *http.Request) {
	sessionContainer := session.GetSessionFromRequestContext(r.Context())

	if sessionContainer == nil {
		w.WriteHeader(500)
		w.Write([]byte("no session found"))
		return
	}
	sessionData, err := sessionContainer.GetSessionDataInDatabase()
	if err != nil {
		err = supertokens.ErrorHandler(err, r, w)
		if err != nil {
			w.WriteHeader(500)
			w.Write([]byte(err.Error()))
		}
		return
	}
	w.WriteHeader(200)
	w.Header().Add("content-type", "application/json")
	bytes, err := json.Marshal(map[string]interface{}{
		"sessionHandle":      sessionContainer.GetHandle(),
		"userId":             sessionContainer.GetUserID(),
		"accessTokenPayload": sessionContainer.GetAccessTokenPayload(),
		"sessionData":        sessionData,
	})
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("error in converting to json"))
	} else {
		w.Write(bytes)
	}
}

func tenants(w http.ResponseWriter, r *http.Request) {
	tenantsList, err := multitenancy.ListAllTenants()

	if err != nil {
		err = supertokens.ErrorHandler(err, r, w)
		if err != nil {
			w.WriteHeader(500)
			w.Write([]byte(err.Error()))
		}
		return
	}

	w.WriteHeader(200)
	w.Header().Add("content-type", "application/json")

	bytes, err := json.Marshal(map[string]interface{}{
		"status": "OK",
		"tenants": tenantsList.OK.Tenants,
	})

	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("error in converting to json"))
	} else {
		w.Write(bytes)
	}
}
