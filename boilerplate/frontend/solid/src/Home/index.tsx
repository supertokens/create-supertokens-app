import { Component } from "solid-js";

const Home: Component = () => {
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
                    <nav class="buttons">
                        <a href="/auth" class="dashboard-button">
                            Sign-up / Login
                        </a>
                        <a href="/dashboard" class="dashboard-button">
                            Dashboard
                        </a>
                    </nav>
                </div>
            </section>
        </>
    );
};

export default Home;
