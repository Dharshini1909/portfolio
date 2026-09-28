export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);

    // If requested file is a PDF:
    // When ?download=1 is present (mobile), serve Content-Disposition: attachment
    // Otherwise (desktop default), serve Content-Disposition: inline
    if (url.pathname.toLowerCase().endsWith('.pdf')) {
      const isDownload = url.searchParams.has('download');
      const headers = new Headers(response.headers);
      headers.delete('Content-Disposition');
      headers.set('Content-Disposition', isDownload ? 'attachment' : 'inline');
      headers.delete('Content-Type');
      headers.set('Content-Type', 'application/pdf');
      headers.set('X-Content-Type-Options', 'nosniff');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }

    return response;
  }
};
