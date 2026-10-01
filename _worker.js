export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const pathnameLower = pathname.toLowerCase();

    // Detect document/certificate assets by extension or path prefix
    const isPdf  = pathnameLower.endsWith('.pdf');
    const isPng  = pathnameLower.endsWith('.png');
    const isJpg  = pathnameLower.endsWith('.jpg') || pathnameLower.endsWith('.jpeg');
    const isDoc  = isPdf || isPng || isJpg || pathnameLower.startsWith('/certificates/');

    // Strip all query params before looking up the static asset.
    // This ensures ?v=... cache-busters never cause a 404 from the asset manifest.
    const cleanUrl = new URL(request.url);
    cleanUrl.search = '';
    const cleanRequest = new Request(cleanUrl.toString(), request);

    let response = await env.ASSETS.fetch(cleanRequest);

    // Fallback: try URL-decoded path if percent-encoded path returned 404
    if (response.status === 404 && isDoc) {
      try {
        const decoded = decodeURIComponent(cleanUrl.pathname);
        if (decoded !== cleanUrl.pathname) {
          const altUrl = new URL(cleanUrl.toString());
          altUrl.pathname = decoded;
          const alt = await env.ASSETS.fetch(new Request(altUrl.toString(), request));
          if (alt.status === 200) response = alt;
        }
      } catch (_) {}
    }

    // Only override headers for document assets that actually exist (200 OK)
    if (isDoc && response.status === 200) {
      const contentType = response.headers.get('content-type') || '';

      // Safety: never disguise an HTML fallback page as a PDF
      if (isPdf && contentType.includes('text/html')) {
        return response;
      }

      const headers = new Headers(response.headers);

      // ── Content-Disposition ─────────────────────────────────────────────────
      // Always serve INLINE for both mobile and desktop.
      //
      // Rationale:
      //   • Mobile Chrome (Android) and Safari (iOS) both have built-in PDF
      //     viewers and will display PDFs opened in a new tab normally.
      //   • Returning Content-Disposition: attachment on mobile causes the
      //     browser download manager to intercept the request, leaving a blank
      //     tab open. On the SECOND file tap, that stale blank tab or the
      //     browser's navigation state blocks further taps from working until
      //     a page refresh.
      //   • "inline" keeps the PDF in a browser tab that can be closed and
      //     re-opened repeatedly without any navigation-state side-effects.
      //   • Users who want to save the file can use the PDF viewer's own
      //     download button — this is the standard pattern used by every major
      //     site (GitHub, LinkedIn, Google Drive, etc.).
      //   • We do NOT use User-Agent detection: UA-based branching combined
      //     with Cloudflare CDN caching (which serves HIT responses from edge)
      //     causes cache collisions where a mobile user receives an "inline"
      //     response cached for a desktop hit, or vice-versa.
      headers.delete('Content-Disposition');
      headers.set('Content-Disposition', 'inline');

      // ── MIME type ────────────────────────────────────────────────────────────
      if (isPdf) {
        headers.delete('Content-Type');
        headers.set('Content-Type', 'application/pdf');
      } else if (isPng) {
        headers.delete('Content-Type');
        headers.set('Content-Type', 'image/png');
      } else if (isJpg) {
        headers.delete('Content-Type');
        headers.set('Content-Type', 'image/jpeg');
      }

      headers.set('X-Content-Type-Options', 'nosniff');

      // Cache-Control: allow CDN/browser to cache, but revalidate on next load.
      // No Vary header — the response is now the same for every client.
      headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
      headers.delete('Vary'); // remove any stale Vary: User-Agent from previous deploys

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  },
};
