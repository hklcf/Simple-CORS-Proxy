# Simple CORS Proxy

A lightweight and configurable CORS proxy service built for Cloudflare Workers. This proxy allows you to bypass CORS restrictions while maintaining security through configurable domain whitelisting.

## Features

- 🚀 Easy to deploy on Cloudflare Workers
- 🔒 Configurable domain whitelisting
- 🎛️ Simple toggle for allowing all domains (development mode)
- 🔄 Supports all HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
- 📝 Customizable CORS headers
- 🔍 Automatic handling of query parameters
- 🌐 Custom User-Agent support

## Quick Start

1. Clone this repository
2. Deploy to Cloudflare Workers:
```bash
wrangler publish
```

## Usage

Send requests to your worker URL with the target URL as a query parameter:

```
https://your-worker.workers.dev/?url=https://api.example.com/data
```

## Configuration

The proxy can be configured through environment variables at the top of the script:

```javascript
// Toggle to allow all domains (true) or use whitelist (false)
const ALLOW_ALL_DOMAINS = true;

// Whitelist of allowed domains
const ALLOWED_DOMAINS = [
  'example.com',
  'yourdomain.com'
];
```

### Security Settings

1. **Domain Whitelist Mode**:
   - Set `ALLOW_ALL_DOMAINS = false`
   - Add allowed domains to `ALLOWED_DOMAINS` array

2. **Development Mode**:
   - Set `ALLOW_ALL_DOMAINS = true`
   - All domains will be allowed to use the proxy

## Customization

### CORS Headers

You can customize the CORS headers in the `corsHeaders` object:

```javascript
const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};
```

### User-Agent

The proxy uses a custom User-Agent which can be modified in the `handleRequest` function:

```javascript
newHeaders.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
```

## Security Considerations

- In production, it's recommended to:
  - Set `ALLOW_ALL_DOMAINS = false`
  - Maintain a strict whitelist of allowed domains
  - Regularly review and update the allowed domains list
  - Monitor for abuse or unexpected usage patterns

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
