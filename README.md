# Metadata API

> A RESTful API to get metadata from web pages

## Usage

Request:
```sh
curl https://metadata-api.carllos-nc.workers.dev/metadata?url=https://hono.dev/
```

Response:
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

## Development

```sh
bun install
bun run dev
```

```sh
bun run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```sh
bun run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```