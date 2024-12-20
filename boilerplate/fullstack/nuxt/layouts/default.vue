<template>
    <header>
        <div class="header-container">
            <a href="/">
                <img src="/ST.svg" alt="SuperTokens" />
            </a>
        </div>
        <div class="header-container-right">
            <NuxtLink href="https://supertokens.com/docs/guides/getting-started/react" target="_blank"> Docs </NuxtLink>
            <NuxtLink href="https://github.com/supertokens/create-supertokens-app" target="_blank"> CLI Repo </NuxtLink>
        </div>
    </header>
    <div class="App app-container">
        <div class="fill">
            <slot />
        </div>
    </div>
</template>
