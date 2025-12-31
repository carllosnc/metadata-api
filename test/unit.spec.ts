import { describe, expect, test } from "vitest";
import app from "../src";

describe("Test endpoints", () => {
  test('Welcome', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)

    expect(await res.json()).toEqual({
      author: 'Carlos Costa',
      github: 'https://github.com/carllosnc/metadata-api',
      description: 'A RESTful API to get metadata from web pages',
      version: '0.0.5',
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
})
