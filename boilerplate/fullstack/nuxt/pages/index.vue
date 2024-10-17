<template>
    <div class="body">
        <h1>Hello</h1>

        <div v-if="session">
            <div>
                <span>UserId:</span>
                <h3>{{ userId }}</h3>

                <div class="session__btn">
                    <button class="btn" @click="callApi">Call API</button>
                    <button class="btn" @click="onLogout">Sign Out</button>
                </div>
            </div>
        </div>
        <div v-else>
            <div>
                <p>
                    Visit the
                    <a href="https://supertokens.com">SuperTokens tutorial</a> to learn how to build Auth under a day.
                </p>
                <NuxtLink to="/auth">
                    <button class="btn">Sign in</button>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import * as Session from "supertokens-web-js/recipe/session";
import { initSuperTokensWebJS } from "../config/frontend";

export default {
    data() {
        return {
            session: false,
            userId: "",
        };
    },
    async mounted() {
        initSuperTokensWebJS();
        await this.getUserInfo();
    },
    methods: {
        async getUserInfo() {
            this.session = await Session.doesSessionExist();
            if (this.session) {
                this.userId = await Session.getUserId();
            }
        },
        async callApi() {
            const { data, error } = await useFetch("/sessioninfo", {
                method: "GET",
                onResponse({ request, response, options }) {
                    alert(JSON.stringify(response._data, null, 2));
                },
            });
        },
        async onLogout() {
            await Session.signOut();
            window.location.reload();
        },
    },
};
</script>
<style scoped>
.body {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.user {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    padding: 0.1rem;
}

span {
    margin-right: 0.3rem;
    font-size: large;
}

h3 {
    color: #ff7547;
}

h1 {
    color: #ff7547;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
}

.btn {
    border: none;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    color: #fff;
    transition: all 0.2s ease-in;
    background-color: #ff7547;
    font-size: large;
}
.btn:hover {
    box-shadow: 0 8px 25px -8px #ffb399;
}
.session__btn {
    display: flex;
    justify-content: space-around;
}
</style>
