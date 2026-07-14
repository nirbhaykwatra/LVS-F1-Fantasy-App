/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: defaultCache,
    fallbacks: {
        entries: [
            {
                url: "/~offline",
                matcher({ request }) {
                    return request.destination === "document";
                },
            },
        ],
    },
});

serwist.addEventListeners();

self.addEventListener("push", (event) => {
    console.log("Push event received", event);
    if (event.data) {
        let data: { title: string; body: string; icon?: string };
        try {
            data = event.data.json();
        } catch {
            data = { title: "Notification", body: event.data.text() };
        }
        const options: NotificationOptions = {
            body: data.body,
            icon: data.icon || "/icon-192x192.png",
            badge: "/icon-192x192.png",
            data: {
                dateOfArrival: Date.now(),
                primaryKey: "2",
            },
        };
        event.waitUntil(self.registration.showNotification(data.title, options));
    }
});

self.addEventListener("notificationclick", (event) => {
    console.log("Notification click received.");
    event.notification.close();
    event.waitUntil(self.clients.openWindow("/"));
});