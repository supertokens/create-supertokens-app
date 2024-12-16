import { Component } from "solid-js";
import { A } from "@solidjs/router";

const Home: Component = () => {
    return (
        <>
            <section class="logos">
                <img src="/ST.svg" alt="SuperTokens" />
                <span>x</span>
                <img src="/Solid.svg" alt="Solid" />
            </section>
            <section class="main-container">
                <div class="inner-content">
                    <h1>
                        <strong>SuperTokens</strong> x <strong>Solid</strong> <br /> example project
                    </h1>
                    <nav class="buttons">
                        <A href="/auth" class="dashboard-button">
                            Sign-up / Login
                        </A>
                        <A href="/dashboard" class="dashboard-button">
                            Dashboard
                        </A>
                    </nav>
                </div>
            </section>
        </>
    );
};

export default Home;
