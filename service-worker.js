const SW_VERSION = 'v13';
const PS1_CACHE = 'retro-emulator-hub-ps1-files-v2';
const virtualFiles = new Map();

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      if ('caches' in self) await caches.delete(PS1_CACHE);
    } catch (_) {}
    await clients.claim();
    console.log('Retro Emulator Hub service worker active', SW_VERSION);
  })());
});

function clearPrefix(prefix) {
  for (const key of Array.from(virtualFiles.keys())) {
    if (key.includes(prefix)) virtualFiles.delete(key);
  }
}

function registerFiles(data) {
  const files = Array.isArray(data.files) ? data.files : [];
  if (!data.sessionId || !files.length) throw new Error('Geen virtuele bestanden ontvangen.');
  const prefix = data.prefix || '/__retro_virtual__/';
  clearPrefix(prefix);
  for (const file of files) {
    if (!file.path || !file.blob) continue;
    virtualFiles.set(decodeURI(file.path), file.blob);
    virtualFiles.set(file.path, file.blob);
  }
  return { ok: true, count: files.length };
}

self.addEventListener('message', (event) => {
  const data = event.data || {};
  const reply = event.ports && event.ports[0];

  try {
    if (data.type === 'REGISTER_PS1_FILES') {
      const result = registerFiles({ ...data, prefix: '/__retro_ps1__/' });
      reply?.postMessage(result);
      return;
    }

    if (data.type === 'REGISTER_VIRTUAL_FILES') {
      const result = registerFiles({ ...data, prefix: data.prefix || '/__retro_virtual__/' });
      reply?.postMessage(result);
      return;
    }
  } catch (error) {
    reply?.postMessage({ ok: false, error: error.message || String(error) });
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isVirtual = url.pathname.includes('/__retro_ps1__/') || url.pathname.includes('/__retro_virtual__/');
  if (!isVirtual) return;

  event.respondWith((async () => {
    const decodedPath = decodeURI(url.pathname);
    const blob = virtualFiles.get(decodedPath) || virtualFiles.get(url.pathname);
    if (blob) {
      const headers = new Headers({
        'Content-Type': blob.type || 'application/octet-stream',
        'Cache-Control': 'no-store',
        'Accept-Ranges': 'bytes'
      });

      const range = event.request.headers.get('range');
      if (range) {
        const size = blob.size;
        const match = /bytes=(\d+)-(\d*)/.exec(range);
        if (match) {
          const start = Number(match[1]);
          const end = match[2] ? Number(match[2]) : size - 1;
          const chunk = blob.slice(start, end + 1);
          headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
          headers.set('Content-Length', String(chunk.size));
          return new Response(chunk, { status: 206, headers });
        }
      }

      headers.set('Content-Length', String(blob.size));
      return new Response(blob, { headers });
    }

    try {
      const cache = await caches.open(PS1_CACHE);
      const cached = await cache.match(event.request, { ignoreSearch: true });
      if (cached) return cached;
    } catch (_) {}

    return new Response('Retro Emulator Hub: virtual file not found. Reload with Ctrl+F5 and select the file again.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  })());
});
