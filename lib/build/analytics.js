import fetch from "node-fetch";
import { getAnalyticsId } from "./utils";
import os from "os";
export default class AnalyticsManager {
    static async sendAnalyticsEvent(analyticsEvent, userArguments) {
        const url = "";
        const argumentsArray = [];
        if (userArguments !== undefined) {
            if (userArguments.appname !== undefined) {
                argumentsArray.push(`--appname=${userArguments.appname}`);
            }
            if (userArguments.frontend !== undefined) {
                argumentsArray.push(`--frontend=${userArguments.frontend}`);
            }
            if (userArguments.backend !== undefined) {
                argumentsArray.push(`--backend=${userArguments.backend}`);
            }
            if (userArguments.recipe !== undefined) {
                argumentsArray.push(`--recipe=${userArguments.recipe}`);
            }
            if (userArguments.manager !== undefined) {
                argumentsArray.push(`--manager=${userArguments.manager}`);
            }
        }
        const payload = {
            ...analyticsEvent,
            userId: getAnalyticsId(),
            operatingSystem: os.platform(),
            arguments: argumentsArray,
        };
        try {
            await fetch(url, {
                method: "POST",
                body: JSON.stringify(payload),
            });
        } catch (e) {
            // no op
        }
    }
}
