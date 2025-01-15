// Toggle to allow all domains (true) or use whitelist (false)
const ALLOW_ALL_DOMAINS = true;

// Whitelist of allowed domains
const ALLOWED_DOMAINS = [
  'example.com',
  'yourdomain.com'
];

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

// Check if the origin is allowed
function isAllowedOrigin(origin) {
  // If no origin and all domains allowed, return true
  if (!origin && ALLOW_ALL_DOMAINS) return true;
  if (!origin) return false;
  
  // If all domains are allowed, return true
  if (ALLOW_ALL_DOMAINS) return true;
  
  try {
    const hostname = new URL(origin).hostname;
    return ALLOWED_DOMAINS.some(domain => {
      // Support subdomain matching
      // e.g., api.example.com matches example.com
      return hostname === domain || hostname.endsWith('.' + domain);
    });
  } catch {
    return false;
  }
}

// Handle OPTIONS requests (CORS preflight)
function handleOptions(request) {
  const origin = request.headers.get('Origin');
  
  if (!isAllowedOrigin(origin)) {
    return new Response('Origin not allowed', { status: 403 });
  }

  if (origin !== null &&
      request.headers.get('Access-Control-Request-Method') !== null &&
      request.headers.get('Access-Control-Request-Headers') !== null) {
    const responseHeaders = {
      ...corsHeaders,
      'Access-Control-Allow-Origin': origin || '*'
    };

    // Handle CORS preflight request
    return new Response(null, {
      headers: responseHeaders,
    });
  } else {
    // Handle standard OPTIONS request
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
      },
    });
  }
}

// Main request handling function
async function handleRequest(request) {
  const origin = request.headers.get('Origin');
  
  // Check if origin is allowed
  if (!isAllowedOrigin(origin)) {
    return new Response('Origin not allowed', { status: 403 });
  }

  // Get the target URL and parameters
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  
  if (!targetUrl) {
    return new Response('Missing URL parameter', { status: 400 });
  }
  
  // Build complete target URL with all parameters
  const targetUrlObj = new URL(targetUrl);
  // Copy all parameters except 'url'
  url.searchParams.forEach((value, key) => {
    if (key !== 'url') {
      targetUrlObj.searchParams.append(key, value);
    }
  });
  
  const finalTargetUrl = targetUrlObj.toString();

  try {
    // Create new headers with custom User-Agent
    const newHeaders = new Headers(request.headers);
    newHeaders.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    
    // Create modified request
    const modifiedRequest = new Request(finalTargetUrl, {
      method: request.method,
      headers: newHeaders,
      body: request.body,
    });

    // Fetch from target URL
    const response = await fetch(modifiedRequest);
    const responseHeaders = new Headers(response.headers);
    
    // Add necessary CORS headers
    responseHeaders.set('Access-Control-Allow-Origin', origin || '*');
    responseHeaders.set('Access-Control-Allow-Methods', corsHeaders['Access-Control-Allow-Methods']);
    responseHeaders.set('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);

    // Return proxied response
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

// Event listener for incoming requests
addEventListener('fetch', event => {
  const request = event.request;
  
  if (request.method === 'OPTIONS') {
    event.respondWith(handleOptions(request));
  } else {
    event.respondWith(handleRequest(request));
  }
});
