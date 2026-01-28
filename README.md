# Metadata API

[![CI](https://github.com/carllosnc/metadata-api/actions/workflows/ci.yml/badge.svg)](https://github.com/carllosnc/metadata-api/actions/workflows/ci.yml)

> A RESTful API to get metadata from web pages.

## Features

- **General Sites**: Extracts title, description, keywords, image, and favicon from any website.
- **Specialized Providers**:
  - **YouTube**: Detailed video information including thumbnails, author, and statistics.
  - **Twitter/X**: Tweet content, media (images/videos), author info, and stats.

## Documentation

Full documentation is available in the [`docs/`](./docs/README.md) directory:

- [API Reference](./docs/api.md)
- [Development & Deployment](./docs/development.md)

## Response Examples

The API returns JSON responses tailored to the content source.

### General Website

```json
{
  "url": "https://hono.dev/",
  "title": "Hono",
  "description": "A framework for building serverless applications with Cloudflare Workers.",
  "image": "https://hono.dev/assets/images/logo.png",
  "favicon": "https://hono.dev/assets/images/favicon.png",
  "keywords": "hono,cloudflare,workers,serverless,framework"
}
```

### YouTube Video

```json
{
  "title": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
  "author_name": "Rick Astley",
  "author_url": "https://www.youtube.com/c/RickAstley",
  "type": "video",
  "height": 113,
  "width": 200,
  "version": "1.0",
  "provider_name": "YouTube",
  "provider_url": "https://www.youtube.com/",
  "thumbnail_url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  "thumbnail_height": 360,
  "thumbnail_width": 480,
  "html": "\u003Ciframe width=\u0022200\u0022 height=\u0022113\u0022 src=\u0022https://www.youtube.com/embed/dQw4w9WgXcQ?feature=oembed\u0022 frameborder=\u00220\u0022 allow=\u0022accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\u0022 width=\u0022200\u0022 height=\u0022113\u0022 title=\u0022Rick Astley - Never Gonna Give You Up (Official Music Video)\u0022\u003E\u003C/iframe\u003E"
}
```

### Twitter/X Post

```json
{
  "code": 200,
  "message": "OK",
  "tweet": {
    "url": "https://x.com/anime_shots/status/2008237217089540228",
    "text": "Summer Time Rendering (2022)",
    "author": {
      "name": "Anime Shots",
      "screen_name": "anime_shots",
      "followers": 1419887
    },
    "media": {
        "all": [...]
    }
  }
}
```

## Quick Start

Request metadata:

```bash
curl "https://metadata-api.carllos-nc.workers.dev/metadata?url=https://hono.dev/"
```