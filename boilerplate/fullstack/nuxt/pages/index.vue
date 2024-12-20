<template>
    <div id="home-container" class="fill">
        <div class="logos">
            <img src="/ST.svg" alt="SuperTokens" />
            <span>x</span>
            <img src="/nuxt.svg" alt="nuxt" />
        </div>

        <div class="main-container">
            <div class="inner-content">
                <p>
                    <strong>SuperTokens</strong> x <strong>Nuxt</strong> <br />
                    example project
                </p>
                <div class="buttons">
                    <NuxtLink href="/auth" class="sessionButton"> Sign-up / Login </NuxtLink>
                    <NuxtLink href="/dashboard" class="sessionButton"> Dashboard </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
