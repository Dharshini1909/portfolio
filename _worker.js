export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);

    // If requested file is a PDF, ensure it opens inline in browser
    if (url.pathname.toLowerCase().endsWith('.pdf')) {
      const headers = new Headers(response.headers);
      headers.set('Content-Type', 'application/pdf');
      headers.set('Content-Disposition', 'inline');
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
