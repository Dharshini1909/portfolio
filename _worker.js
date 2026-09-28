export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);

    // If requested file is a PDF, ensure clean single-valued inline disposition
    if (url.pathname.toLowerCase().endsWith('.pdf')) {
      const headers = new Headers(response.headers);
      headers.delete('Content-Disposition');
      headers.set('Content-Disposition', 'inline');
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
