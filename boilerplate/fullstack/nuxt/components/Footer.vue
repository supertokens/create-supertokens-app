<script setup lang="ts">
import SeparatorLine from "../assets/separator-line.svg";

interface Link {
    name: string;
    icon: string;
    onClick: () => void;
}

interface FooterProps {
    links: Link[];
}

defineProps<FooterProps>();
</script>

<template>
    <div>
        <div class="bottom-links-container">
            <div v-for="link in links" :key="link.name" class="link">
                <img class="link-icon" :src="link.icon" :alt="link.name" />
                <div role="button" @click="link.onClick">
                    {{ link.name }}
                </div>
            </div>
        </div>
        <img class="separator-line" :src="SeparatorLine" alt="separator" />
    </div>
</template>
