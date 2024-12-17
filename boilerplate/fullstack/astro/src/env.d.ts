/// <reference types="astro/client" />

interface Session {
    accessTokenPayload: any;
    hasToken: boolean;
    error: any;
}

declare namespace App {
    interface Locals {
        session: Session;
    }
}
