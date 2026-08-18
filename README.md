# Metadata API

[![CI](https://github.com/carllosnc/metadata-api/actions/workflows/ci.yml/badge.svg)](https://github.com/carllosnc/metadata-api/actions/workflows/ci.yml)
[![Deploy](https://github.com/carllosnc/metadata-api/actions/workflows/ci.yml/badge.svg?branch=master)](https://metadata-api.carllos-nc.workers.dev)
[![Live](https://img.shields.io/badge/live-metadata--api.carllos--nc.workers.dev-blue)](https://metadata-api.carllos-nc.workers.dev)
[![Version](https://img.shields.io/badge/version-0.1.0-green)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)

> A fast RESTful API to extract **Open Graph**, **oEmbed**, **favicons**, and **rich media metadata** from any URL — with specialized providers for **YouTube** and **Twitter/X**.

Built with [Hono](https://hono.dev) on [Cloudflare Workers](https://workers.cloudflare.com), running on the edge with global low latency. No API key required for the public instance.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Response Formats](#response-formats)
  - [General Website](#general-website)
  - [YouTube Video](#youtube-video)
  - [Twitter/X Post](#twitterx-post)
- [Error Handling](#error-handling)
- [API Reference](#api-reference)
- [Self-Hosting](#self-hosting)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **General Sites**: Extracts title, description, keywords, Open Graph image, Twitter Card image, and favicon from any website.
- **Specialized Providers**:
  - **YouTube**: Full video metadata via oEmbed — title, author, thumbnails, embed HTML, and dimensions.
  - **Twitter/X**: Tweet content, author info, media (images/videos), and engagement stats, via the [fxtwitter](https://github.com/FixTweet/FxTwitter) API.
- **Edge-native**: Runs on Cloudflare's global network — responses are served close to your users.
- **Robust error handling**: Consistent JSON error payloads for invalid URLs, upstream failures, and non-success responses.
- **CORS-friendly**: Preconfigured for common frontend origins (localhost, Vercel previews, and production sites).

## Quick Start

Request metadata for any URL:

```bash
curl "https://metadata-api.carllos-nc.workers.dev/metadata?url=https://hono.dev/"
```

Try it in your browser:

```
https://metadata-api.carllos-nc.workers.dev/metadata?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

JavaScript example:

```js
const res = await fetch(
  "https://metadata-api.carllos-nc.workers.dev/metadata?url=https://hono.dev/"
);
const meta = await res.json();
console.log(meta.title, meta.image, meta.favicon);
```

## Response Formats

The API returns JSON tailored to the content source.

### General Website

`GET /metadata?url=https://hono.dev/`

```json
{
  "url": "https://hono.dev",
  "title": "Hono - Web framework built on Web Standards",
  "description": "Web framework built on Web Standards for Cloudflare Workers, Fastly Compute, Deno, Bun, Vercel, Node.js, and others. Fast, but not only fast.",
  "keywords": null,
  "image": "https://hono.dev/images/hono-title.png",
  "favicon": "https://hono.dev/favicon.ico"
}
```

| Field         | Type   | Description                                                  |
| :------------ | :----- | :----------------------------------------------------------- |
| `url`         | string | The resolved URL (trailing slash stripped)                   |
| `title`       | string | From `<title>`, `og:title`, or `twitter:title`               |
| `description` | string | From `meta[name=description]`, `twitter:description`, or OG  |
| `keywords`    | string | From `meta[name=keywords]`                                   |
| `image`       | string | From `og:image` or `twitter:image`                          |
| `favicon`     | string | Resolved favicon URL from `link[rel*=icon]` and fallbacks    |

### YouTube Video

`GET /metadata?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ`

```json
{
  "title": "Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)",
  "author_name": "Rick Astley",
  "author_url": "https://www.youtube.com/@RickAstleyYT",
  "type": "video",
  "height": 113,
  "width": 200,
  "version": "1.0",
  "provider_name": "YouTube",
  "provider_url": "https://www.youtube.com/",
  "thumbnail_height": 360,
  "thumbnail_width": 480,
  "thumbnail_url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  "html": "<iframe ...></iframe>",
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

Powered by YouTube's [oEmbed](https://developers.google.com/youtube/v3/guides/oembed) endpoint. Accepts `youtube.com/watch`, `youtu.be/`, and `m.youtube.com` URLs.

### Twitter/X Post

`GET /metadata?url=https://x.com/anime_shots/status/2008237217089540228`

```json
{
  "code": 200,
  "message": "OK",
  "tweet": {
    "url": "https://x.com/anime_shots/status/2008237217089540228",
    "id": "2008237217089540228",
    "text": "Summer Time Rendering (2022)",
    "raw_text": { "text": "...", "facets": [...] },
    "author": {
      "name": "Anime Shots",
      "screen_name": "anime_shots",
      "followers": 1432288
    },
    "media": {
      "all": [...],
      "videos": [...]
    },
    "replies": 7,
    "retweets": 139,
    "likes": 3426,
    "views": 696221
  }
}
```

Accepts both `twitter.com` and `x.com` status URLs. The full payload (with all media variants, stats, and `created_at`) is documented in the [fxtwitter API](https://github.com/FixTweet/FxTwitter).

## Error Handling

All errors return JSON with a consistent shape:

```json
{ "error": true, "message": "..." }
```

| Status | Cause                                                                 |
| :----- | :-------------------------------------------------------------------- |
| `400`  | Missing or invalid `url` query parameter (must be a valid HTTP(S) URL) |
| `403`  | Request blocked by CSRF middleware (missing `Origin`/`Referer`)       |
| `502`  | Upstream fetch failed (network error) or target returned non-success  |
| `500`  | Unexpected internal error                                             |

Example:

```bash
$ curl "https://metadata-api.carllos-nc.workers.dev/metadata?url=not-a-url"
{ "error": true, "message": "The URL must be a valid HTTP/HTTPS URL." }
```

## API Reference

### `GET /`

Returns API metadata (author, repo, description, version).

### `GET /metadata`

Fetch metadata for a URL. The provider is auto-detected.

**Query parameters:**

| Name  | Type     | Required | Description                          |
| :---- | :------- | :------- | :----------------------------------- |
| `url` | `string` | Yes      | A valid HTTP/HTTPS URL to inspect    |

**Provider detection:**

| URL pattern                              | Provider           |
| :--------------------------------------- | :----------------- |
| `youtube.com`, `youtu.be`, `m.youtube.*` | YouTube (oEmbed)   |
| `twitter.com/*/status/*`, `x.com/*/status/*` | Twitter/X (fxtwitter) |
| anything else                            | Generic scraper    |

Full request/response examples are in [`docs/api.md`](./docs/api.md).

## Self-Hosting

This API runs on Cloudflare Workers and can be deployed to your own account in minutes.

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- A [Cloudflare](https://dash.cloudflare.com) account
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI (installed as a devDependency)

### Steps

```bash
git clone https://github.com/carllosnc/metadata-api.git
cd metadata-api
bun install

bun run dev          # local dev with --remote (uses real Cloudflare backend)
bun run test         # run unit tests
bun run typecheck    # type-check
bun run deploy       # deploy to your Cloudflare account
```

For CI/CD, set the `CLOUDFLARE_API_TOKEN` repository secret and reuse the included [workflow](./.github/workflows/ci.yml) — it runs tests on every PR and deploys on push to `master`.

See [`docs/development.md`](./docs/development.md) for details.

## Tech Stack

- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com)
- **Framework**: [Hono](https://hono.dev) v4
- **Validation**: [Zod](https://zod.dev) v4 via [`@hono/zod-validator`](https://github.com/honojs/middleware/tree/main/packages/zod-validator)
- **HTML parsing**: [cheerio](https://cheerio.js.org) v1
- **Package manager / test runner**: [Bun](https://bun.sh) + [Vitest](https://vitest.dev)
- **Language**: TypeScript (strict)

## Project Structure

```
src/
├── index.ts              # Hono app, routes, error handler
├── middlewares/
│   └── validation.ts     # Zod-based URL query validator
└── providers/
    ├── any-site.ts       # Generic OG/Twitter-card scraper
    ├── youtube.ts        # YouTube oEmbed provider
    └── twitter.ts        # Twitter/X via fxtwitter
test/
└── unit.spec.ts          # Unit tests (with mocked upstream fetch)
docs/
├── api.md                # Endpoint reference
└── development.md        # Setup, testing, deployment
```

## Contributing

Contributions are welcome! Please open an issue first to discuss new providers or breaking changes.

1. Fork the repo and create a feature branch.
2. Run `bun install`, `bun run test`, and `bun run typecheck` before submitting.
3. Open a Pull Request — CI will run tests automatically.

## License

MIT © [Carlos Costa](https://github.com/carllosnc)
