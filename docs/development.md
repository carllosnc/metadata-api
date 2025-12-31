# Development & Deployment

## Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or later)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (for Cloudflare Workers)

## Local Development

1.  **Install dependencies:**

    ```bash
    bun install
    ```

2.  **Run the development server:**

    ```bash
    bun run dev
    ```

    The API will be available at `http://localhost:8787`.

## Testing

Run unit tests using Vitest:

```bash
bun run test
```

## Type Generation

Generate types based on your Worker configuration:

```bash
bun run cf-typegen
```

## Deployment

Deploy the worker to Cloudflare:

```bash
bun run deploy
```

## Project Structure

- `src/`: Source code
  - `index.ts`: Entry point and route definitions
  - `middlewares/`: Custom middlewares
  - `providers/`: Logic for fetching metadata from different sources (Youtube, generic)
- `test/`: Unit tests
- `docs/`: Project documentation
