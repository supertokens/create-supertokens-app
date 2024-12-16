<script setup lang="ts">
import * as Session from "supertokens-web-js/recipe/session";
import Footer from "~/components/Footer.vue";
import SessionInfo from "~/components/SessionInfo.vue";

import BlogsIcon from "~/assets/blogs-icon.svg";
import CelebrateIcon from "~/assets/celebrate-icon.svg";
import GuideIcon from "~/assets/guide-icon.svg";
import SignOutIcon from "~/assets/sign-out-icon.svg";

const router = useRouter();
const userId = ref<string | null>(null);

// Redirect to auth if user is not logged in
definePageMeta({
    middleware: [
        async function (to, from) {
            if (!(await Session.doesSessionExist())) {
                return navigateTo("/auth");
            }
        },
    ],
});

// Get user id from session
onMounted(async () => {
    if (await Session.doesSessionExist()) {
        userId.value = await Session.getUserId();
    }
});

async function logoutClicked() {
    await Session.signOut();
    router.push("/auth");
}

function openLink(url: string) {
    window.open(url, "_blank");
}

const links = [
    {
        name: "Blogs",
        onClick: () => openLink("https://supertokens.com/blog"),
        icon: BlogsIcon,
    },
    {
        name: "Documentation",
        onClick: () => openLink("https://supertokens.com/docs/"),
        icon: GuideIcon,
    },
    {
        name: "Sign Out",
        onClick: logoutClicked,
        icon: SignOutIcon,
    },
];
</script>

<template>
    <div class="fill" id="home-container">
        <div class="main-container">
            <div class="top-band success-title bold-500">
                <img :src="CelebrateIcon" alt="Login successful" class="success-icon" /> Login successful
            </div>
            <div class="inner-content">
                <div>Your userID is:</div>
                <div class="truncate" id="user-id">
                    {{ userId }}
                </div>
                <SessionInfo />
            </div>
        </div>
        <Footer :links="links" />
    </div>
</template>
