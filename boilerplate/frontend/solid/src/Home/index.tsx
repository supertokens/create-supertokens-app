import { Component, createSignal, onMount, Show } from "solid-js";
import Session from "supertokens-web-js/recipe/session";

const Home: Component = () => {
    const [sessionExists, setSessionExists] = createSignal(false);

    onMount(async () => {
        setSessionExists(await Session.doesSessionExist());
    });

    return (
        <>
            <section class="logos">
                <img src="/ST.svg" alt="SuperTokens" />
                <span>x</span>
                <img src="/solid.svg" alt="Solid" />
            </section>
            <section class="main-container">
                <div class="inner-content">
                    <h1>
                        <strong>SuperTokens</strong> x <strong>Solid</strong> <br /> example project
                    </h1>
                    <div>
                        {sessionExists() ? (
                            <p>
                                You're signed in already, <br /> check out the Dashboard! 👇
                            </p>
                        ) : (
                            <p>Sign-in to continue</p>
                        )}
                    </div>
                    <nav class="buttons">
                        {sessionExists() ? (
                            <a href="/dashboard" class="dashboard-button">
                                Dashboard
                            </a>
                        ) : (
                            <a href="/auth" class="dashboard-button">
                                Sign-up / Login
                            </a>
                        )}
                    </nav>
                </div>
            </section>
        </>
    );
};

export default Home;
