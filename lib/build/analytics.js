import fetch from "node-fetch";
import { getAnalyticsId } from "./utils.js";
import os from "os";
export default class AnalyticsManager {
    static async sendAnalyticsEvent(analyticsEvent) {
        const url = "https://api.supertokens.com/0/analytics/cli";
        const analyticsId = await getAnalyticsId();
        const payload = {
            ...analyticsEvent,
            userId: analyticsId,
            os: os.platform(),
        };
        try {
            await fetch(url, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                    "api-version": "0",
                },
            });
        } catch (e) {
            // no op
        }
    }
}
