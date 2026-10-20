const CACHE_NAME = "dice-game-debug-v1";

const FILES_TO_CACHE = [
"./",
"./index.html",
"./style.css",
"./index.js",
"./die.jpeg",
"./dice%20pic.jpeg",
"./manifest.json",
"./icons/icon-192.png",
"./icons/icon-512.png"
];

self.addEventListener("install", event => {
event.waitUntil(
(async () => {
const cache = await caches.open(CACHE_NAME);


        for (const file of FILES_TO_CACHE) {
            try {
                const url = new URL(file, self.registration.scope);
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                await cache.put(url.href, response.clone());

                console.log("CACHED:", url.href);
            } catch (error) {
                console.error("FAILED:", file, error);
            }
        }

        await self.skipWaiting();
    })()
);


});

self.addEventListener("activate", event => {
event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
event.respondWith(
caches.match(event.request).then(response => {
return response || fetch(event.request);
})
);
});
