if ('undefined' !== typeof self) {
    self.addEventListener('fetch', (event) => {
      if (event.request.destination === 'image') {
        event.respondWith(
          caches.open('image-cache-v1').then((cache) => {
            return cache.match(event.request).then((response) => {
              return (
                response ||
                fetch(event.request).then((networkResponse) => {
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
                })
              );
            });
          })
        );
      }
    });
  }
  