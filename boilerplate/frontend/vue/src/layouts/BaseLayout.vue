<template>
    <header>
        <div class="header-container">
            <a href="/">
                <img src="/ST.svg" alt="SuperTokens" />
            </a>
        </div>
        <div class="header-container-right">
            <a href="https://supertokens.com/docs/thirdpartyemailpassword/quickstart/frontend-setup" target="_blank">
                Docs
            </a>
            <a href="https://github.com/supertokens/create-supertokens-app" target="_blank"> CLI Repo </a>
        </div>
    </header>
    <div class="App app-container">
        <div class="fill">
            <slot />
        </div>
    </div>
</template>
