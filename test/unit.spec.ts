import { describe, expect, test, vi, afterEach } from "vitest";
import app from "../src";

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("Test endpoints", () => {
  test('Welcome', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)

    expect(await res.json()).toEqual({
      author: 'Carlos Costa',
      github: 'https://github.com/carllosnc/metadata-api',
      description: 'A RESTful API to get metadata from web pages',
      version: '0.1.0',
    })
  })

  test.each([
    'invalid-url',
    'http://',
    'ftp://google.com',
    'just-text',
    '//missing-protocol',
    'mailto:info@example.com',
  ])('Invalid URL: %s', async (url) => {
    const res = await app.request(`/metadata?url=${url}`)
    expect(res.status).toBe(400)
  })

  test('Missing URL parameter', async () => {
    const res = await app.request('/metadata')
    expect(res.status).toBe(400)
  })

  test('Returns 502 when upstream fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const res = await app.request('/metadata?url=https://example.com')
    expect(res.status).toBe(502)
    expect(await res.json()).toEqual({
      error: true,
      message: 'Failed to fetch the URL: network down',
    })
  })

  test('Returns 502 when upstream responds with non-ok status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response('Not Found', { status: 404 })
    ))
    const res = await app.request('/metadata?url=https://example.com')
    expect(res.status).toBe(502)
    expect(await res.json()).toEqual({
      error: true,
      message: 'Upstream responded with status 404',
    })
  })

  test('Returns 502 when YouTube oEmbed fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')))
    const res = await app.request('/metadata?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    expect(res.status).toBe(502)
    const json = await res.json() as { error: boolean, message: string }
    expect(json).toMatchObject({ error: true })
    expect(json.message).toContain('YouTube')
  })

  test('Metadata for any site', async () => {
    const res = await app.request('/metadata?url=https://github.com')
    expect(res.status).toBe(200)
    const json = await res.json()

    expect(json).toHaveProperty('title')
    expect(json).toHaveProperty('url')
    expect(json).toHaveProperty('image')
    expect(json).toHaveProperty('favicon')
    expect(json).toHaveProperty('description')
    expect(json).toHaveProperty('keywords')
  })

  test('Metadata for youtube', async () => {
    const res = await app.request('/metadata?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    expect(res.status).toBe(200)
    const json = await res.json()

    expect(json).toHaveProperty('title')
    expect(json).toHaveProperty('url')
    expect(json).toHaveProperty('author_name')
    expect(json).toHaveProperty('author_url')
    expect(json).toHaveProperty('type')
    expect(json).toHaveProperty('height')
    expect(json).toHaveProperty('width')
    expect(json).toHaveProperty('version')
    expect(json).toHaveProperty('provider_name')
    expect(json).toHaveProperty('provider_url')
    expect(json).toHaveProperty('thumbnail_url')
    expect(json).toHaveProperty('thumbnail_height')
    expect(json).toHaveProperty('thumbnail_width')
    expect(json).toHaveProperty('html')
  })

  test('Metadata for twitter', async () => {
    const res = await app.request('/metadata?url=https://x.com/anime_shots/status/2008237217089540228')
    expect(res.status).toBe(200)
    const json = await res.json()

    expect(json).toHaveProperty('code')
    expect(json).toHaveProperty('message')
    expect(json).toHaveProperty('tweet')
    expect(json).toHaveProperty('tweet.url')
    expect(json).toHaveProperty('tweet.id')
    expect(json).toHaveProperty('tweet.text')
    expect(json).toHaveProperty('tweet.raw_text')
  })

  test('Metadata for x.com', async () => {
    const res = await app.request('/metadata?url=https://x.com/anime_shots/status/2008237217089540228')
    expect(res.status).toBe(200)
    const json = await res.json()

    expect(json).toHaveProperty('code')
    expect(json).toHaveProperty('message')
    expect(json).toHaveProperty('tweet')
    expect(json).toHaveProperty('tweet.url')
    expect(json).toHaveProperty('tweet.id')
    expect(json).toHaveProperty('tweet.text')
    expect(json).toHaveProperty('tweet.raw_text')
  })
})

