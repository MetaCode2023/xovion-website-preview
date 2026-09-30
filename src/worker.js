export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!['GET', 'HEAD'].includes(request.method)) {
      return Response.json({error: 'No submissions are accepted by this starter.'}, {status:405, headers:{Allow:'GET, HEAD'}});
    }
    if (url.pathname.startsWith('/api/')) return Response.json({error:'No API configured'}, {status:404});
    const asset = await env.ASSETS.fetch(request);
    const response = new Response(asset.body, asset);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    const localReload = env.LOCAL_DEV === "true" && env.SITE_STAGE !== "production" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    response.headers.set('Content-Security-Policy', `default-src 'self'; script-src 'self'${localReload ? " 'unsafe-inline'" : ""}; style-src 'self'; img-src 'self' data:; connect-src 'self'${localReload ? " ws://localhost:* ws://127.0.0.1:*" : ""}; form-action 'none'; frame-ancestors 'none'; base-uri 'none'`);
    if (env.SITE_STAGE !== 'production') response.headers.set('X-Robots-Tag','noindex, nofollow');
    return response;
  }
};
