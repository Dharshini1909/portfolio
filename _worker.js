export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const pathnameLower = pathname.toLowerCase();

    // Check if the requested asset is a PDF or document in certificates/
    const isPdf = pathnameLower.endsWith('.pdf');
    const isPng = pathnameLower.endsWith('.png');
    const isJpg = pathnameLower.endsWith('.jpg') || pathnameLower.endsWith('.jpeg');
    const isDoc = isPdf || isPng || isJpg || pathnameLower.startsWith('/certificates/');

    // Determine if request is from mobile or explicitly requested as download
    const ua = request.headers.get('user-agent') || '';
    const chMobile = request.headers.get('sec-ch-ua-mobile');
    const isMobileUA = chMobile === '?1' || /Android|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    // Explicit query params override UA detection if present
    const hasDownloadParam = url.searchParams.has('download');
    const hasInlineParam = url.searchParams.has('inline') || url.searchParams.has('view');
    const isDownload = hasDownloadParam || (isMobileUA && !hasInlineParam);

    // 1. Clean URL for static asset lookup by stripping query parameters
    // This guarantees asset manifest lookup finds the exact file on disk
    const cleanUrl = new URL(request.url);
    cleanUrl.search = '';
    const cleanRequest = new Request(cleanUrl.toString(), request);

    let response = await env.ASSETS.fetch(cleanRequest);

    // If 404, attempt with decoded pathname in case static asset keying differs
    if (response.status === 404) {
      try {
        const decodedPath = decodeURIComponent(cleanUrl.pathname);
        if (decodedPath !== cleanUrl.pathname) {
          const altUrl = new URL(cleanUrl.toString());
          altUrl.pathname = decodedPath;
          const altResp = await env.ASSETS.fetch(new Request(altUrl.toString(), request));
          if (altResp.status === 200) {
            response = altResp;
          }
        }
      } catch (e) {}
    }

    // 2. Only modify headers for valid document assets (HTTP 200)
    // NEVER apply PDF/attachment headers to 404s, error pages, or HTML fallbacks!
    if (isDoc && response.status === 200) {
      const contentType = response.headers.get('content-type') || '';

      // Safety check: If asset fetch returned HTML (e.g. fallback to index.html),
      // do NOT disguise HTML as a downloadable PDF/document
      if (isPdf && contentType.includes('text/html')) {
        return response;
      }

      // Extract and sanitize filename
      const rawFilename = pathname.substring(pathname.lastIndexOf('/') + 1);
      let filename = 'document.pdf';
      try {
        filename = decodeURIComponent(rawFilename);
      } catch (e) {
        filename = rawFilename;
      }
      const safeFilename = filename.replace(/["\r\n]/g, '').trim() || (isPdf ? 'document.pdf' : 'file');
      const asciiFilename = safeFilename.replace(/[^\x20-\x7E]/g, '_');
      const encodedFilename = encodeURIComponent(safeFilename)
        .replace(/['()]/g, escape)
        .replace(/\*/g, '%2A');

      const headers = new Headers(response.headers);
      headers.delete('Content-Disposition');

      if (isDownload) {
        // MOBILE DOWNLOAD: force attachment with RFC 6266 / RFC 5987 filename
        headers.set(
          'Content-Disposition',
          `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`
        );
      } else {
        // DESKTOP: open/view inline in browser
        headers.set('Content-Disposition', 'inline');
      }

      // Ensure correct MIME type
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
      headers.set('Vary', 'User-Agent, Sec-CH-UA-Mobile');
      headers.set('Cache-Control', 'public, max-age=0, must-revalidate');

      // Preserve the exact response body stream without corruption
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }

    return response;
  }
};
