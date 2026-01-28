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

## Quick Start

Request metadata:

```bash
curl https://metadata-api.carllos-nc.workers.dev/metadata?url=https://hono.dev/
```