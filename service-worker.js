
// ========================================
// DICE ROLL CLUB SERVICE WORKER
// ========================================

const CACHE_NAME = "dice-game-v3";


// ========================================
// CORE GAME FILES
// These must be cached for offline gameplay.
// ========================================

const CORE_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./index.js",
    "./die.jpeg",
    "./dice%20pic.jpeg",
    "./manifest.json"
];


// ========================================
// OPTIONAL APP ICONS
// ========================================

const OPTIONAL_FILES = [
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];


// ========================================
// INSTALL
// Cache the essential game files.
// ========================================

self.addEventListener("install", event => {

    event.waitUntil(
        (async () => {

            const cache = await caches.open(CACHE_NAME);

            // Cache essential files.
            // If an essential file is missing, installation fails
            // rather than silently claiming offline support works.
            await cache.addAll(CORE_FILES);

            // Cache icons separately so a missing icon
            // does not prevent the game itself from working.
            await Promise.all(
                OPTIONAL_FILES.map(async file => {

                    try {
                        await cache.add(file);

                    } catch (error) {
                        console.warn(
                            "Could not cache optional file:",
                            file,
                            error
                        );
                    }

                })
            );

            // Activate the updated worker sooner.
            await self.skipWaiting();

            console.log("Dice Roll Club files cached!");

        })()
    );

});


// ========================================
// ACTIVATE
// Delete old versions of this game's cache.
// ========================================

self.addEventListener("activate", event => {

    event.waitUntil(
        (async () => {

            const cacheNames = await caches.keys();

            await Promise.all(
                cacheNames
                    .filter(name =>
                        name.startsWith("dice-game-") &&
                        name !== CACHE_NAME
                    )
                    .map(name => caches.delete(name))
            );

            // Let the new worker control open pages.
            await self.clients.claim();

            console.log("Dice Roll Club is ready!");

        })()
    );

});


// ========================================
// FETCH
// Online: get fresh HTML, CSS and JavaScript.
// Offline: use cached files.
// ========================================

self.addEventListener("fetch", event => {

    const request = event.request;

    // Only handle normal GET requests.
    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    // Ignore requests to other websites.
    if (url.origin !== self.location.origin) {
        return;
    }

    // Only use the worker for files within its own folder.
    if (!url.href.startsWith(self.registration.scope)) {
        return;
    }

    // HTML, CSS and JavaScript should update when online.
    const isPageOrCode =
        request.mode === "navigate" ||
        url.pathname.endsWith(".html") ||
        url.pathname.endsWith(".css") ||
        url.pathname.endsWith(".js") ||
        url.pathname.endsWith(".json");


    if (isPageOrCode) {

        // NETWORK FIRST:
        // Try the latest version, then fall back to the cache.

        event.respondWith(
            (async () => {

                try {

                    const response = await fetch(request);

                    if (response.ok) {

                        const cache = await caches.open(CACHE_NAME);

                        await cache.put(
                            request,
                            response.clone()
                        );

                    }

                    return response;

                } catch (error) {

                    // Use the cached copy if the internet is unavailable.
                    const cachedResponse = await caches.match(request);

                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // Offline navigation fallback.
                    if (request.mode === "navigate") {

                        const offlinePage = await caches.match(
                            new URL(
                                "./index.html",
                                self.registration.scope
                            ).href
                        );

                        if (offlinePage) {
                            return offlinePage;
                        }

                    }

                    return new Response(
                        "This file is not available offline.",
                        {
                            status: 503,
                            statusText: "Service Unavailable",
                            headers: {
                                "Content-Type": "text/plain; charset=utf-8"
                            }
                        }
                    );

                }

            })()
        );

        return;
    }


    // ========================================
    // IMAGES AND OTHER STATIC ASSETS
    // CACHE FIRST, THEN NETWORK
    // ========================================

    event.respondWith(
        (async () => {

            const cachedResponse = await caches.match(request);

            if (cachedResponse) {
                return cachedResponse;
            }

            try {

                const response = await fetch(request);

                if (response.ok) {

                    const cache = await caches.open(CACHE_NAME);

                    await cache.put(
                        request,
                        response.clone()
                    );

                }

                return response;

            } catch (error) {

                return new Response(
                    "This resource is not available offline.",
                    {
                        status: 503,
                        statusText: "Service Unavailable"
                    }
                );

            }

        })()
    );

});

