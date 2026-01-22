// sw.js - Service Worker Simples
self.addEventListener('install', (event) => {
    console.log('Service Worker instalado.');
});

self.addEventListener('fetch', (event) => {
    // Necessário para o Chrome validar a instalação
    event.respondWith(fetch(event.request));
});