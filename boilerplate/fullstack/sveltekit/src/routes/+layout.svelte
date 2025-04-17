<script lang="ts">
  import "../styles/app.css";
  import { ensureSuperTokensInit } from "../config/backendConfigUtils";

  ensureSuperTokensInit();
</script>

<svelte:head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/ST.svg" />
    <title>SvelteKit SuperTokens demo</title>
</svelte:head>
<main class="App app-container">
    <header>
        <nav class="header-container">
            <a href="/">
                <img src="/ST.svg" alt="SuperTokens" />
            </a>
            <ul class="header-container-right">
                <li>
                    <a
                        href="https://supertokens.com/docs//"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Docs
                    </a>
                </li>
                <li>
                    <a
                        href="https://github.com/supertokens/create-supertokens-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        CLI Repo
                    </a>
                </li>
            </ul>
        </nav>
    </header>
    <div class="fill" id="home-container">
        <slot />
        <footer>
            Built with ❤️ by the folks at{" "}
            <a href="https://supertokens.io" target="_blank" rel="noopener noreferrer">
                supertokens.com
            </a>
            .
        </footer>
        <img class="separator-line" src="/assets/images/separator-line.svg" alt="separator" />
    </div>
    <script>
        import { initSuperTokensWebJS } from "../config/frontend";
        initSuperTokensWebJS();
    </script>
</main>
