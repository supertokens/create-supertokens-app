<template>
    <header>
        <nav className="header-container">
            <NuxtLink to="/">
                <img src="/ST.svg" alt="SuperTokens" />
            </NuxtLink>
            <ul className="header-container-right">
                <li>
                    <a href="https://supertokens.com/docs//" target="_blank" rel="noopener noreferrer"> Docs </a>
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
        <client-only>
            <slot />
            <footer>
                Built with ❤️ by the folks at
                <a href="https://supertokens.io" target="_blank" rel="noopener noreferrer"> supertokens.com </a>
                .
            </footer>
            <img className="separator-line" src="../assets/images/separator-line.svg" alt="separator" />
        </client-only>
    </div>
</template>
