# API Reference

The Metadata API provides endpoints to fetch metadata from URLs.

## Base URL

In development: `http://localhost:8787`
In production: `https://metadata-api.carllos-nc.workers.dev`

## Endpoints

### `GET /`

Returns API information and status.

**Response:**

```json
{
  "author": "Carlos Costa",
  "github": "https://github.com/carllosnc/metadata-api",
  "description": "A RESTful API to get metadata from web pages",
  "version": "0.1.0"
}
```

### `GET /metadata`

Fetches metadata for a specific URL.

**Parameters:**

| Name  | Type     | Required | Description                  |
| :---- | :------- | :------- | :--------------------------- |
| `url` | `string` | Yes      | The URL to fetch metadata from |

**Example Request:**

```bash
curl "https://metadata-api.carllos-nc.workers.dev/metadata?url=https://hono.dev/"
```

**Example Response (General):**

The response structure varies depending on the provider (General, YouTube, Twitter).

**General Site:**

```json
{
  "url": "https://hono.dev/",
  "title": "Hono",
  "description": "A framework for building serverless applications with Cloudflare Workers.",
  "keywords": "hono,cloudflare,workers,serverless,framework,web,api,rest,http,json,graphql",
  "image": "https://hono.dev/assets/images/logo.png",
  "favicon": "https://hono.dev/assets/images/favicon.png"
}
```

**Twitter/X:**

```json
{
  "code": 200,
  "message": "OK",
  "tweet": {
    "url": "https://x.com/username/status/1234567890",
    "text": "Hello world",
    "author": {
      "name": "User",
      "screen_name": "username"
    }
  }
}
```

**Error Response (400 Bad Request):**

If the URL is missing or invalid.

**Error Response (502 Bad Gateway):**

Returned when the upstream fetch fails or the target server responds with a non-success status.

```json
{
  "error": true,
  "message": "Failed to fetch the URL: network down"
}
```
