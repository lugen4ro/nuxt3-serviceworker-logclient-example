import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
    if ('serviceWorker' in navigator) {

        onNuxtReady(() => {
            navigator.serviceWorker.register('/serviceworker.js', { scope: "/" })
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.log('Service Worker registration failed:', error);
                });
        }
        )
    }
})



