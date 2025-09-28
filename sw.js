console.log('[SW] Service worker script loaded');

  '/login.html',
  '/register.html',
  '/materi.html',
  '/forum.html',
  '/chat.html',
  '/profil.html',
  '/admin-dashboard.html',
  '/offline.html',
  '/manifest.json',
  
  // CSS & JS files
  '/auth-service.js',
  '/auth-guard.js',
  '/auth-ui.js',
  '/config.js',
  '/firebase-init.js',
  '/supabase.js',
  '/gemini-service.js',
  '/materials-service.js',
  '/materials-display.js',
  '/materi-search.js',
  '/forum-logic.js',
  '/forum-search.js',
  '/chat-logic.js',
  '/test-logic.js',
  '/user-stats.js',
  '/pwa-installer.js',
  
  // Icons
  '/icons/icon-32x32.svg',
  '/icons/icon-144x144.svg',
  '/icons/icon-152x152.svg',
  '/icons/icon-192x192.svg'

// External resources (cache opportunistically)
const EXTERNAL_RESOURCES = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install event - cache files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching local files only');
        // Filter out external CDN URLs to avoid CORS
        const localFiles = CACHE_FILES.filter(url => 
          !url.startsWith('https://cdn.tailwindcss.com') &&
          !url.startsWith('https://fonts.googleapis.com')
        );
        return cache.addAll(localFiles);
      })
      .catch((error) => {
        console.error('[SW] Failed to cache files:', error);
      })
  );
  
  self.skipWaiting();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !EXTERNAL_RESOURCES.some(url => event.request.url.startsWith(url))) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('[SW] Serving from cache:', event.request.url);
          return response;
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If both cache and network fail, show offline page
            if (event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});