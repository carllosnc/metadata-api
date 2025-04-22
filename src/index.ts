import { Hono } from 'hono'
import { urlValidation } from './middlewares/validation'
import * as cheerio from 'cheerio';
import { csrf } from 'hono/csrf'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(csrf())

app.use('*', cors({
  origin: [
    'http://localhost:5173/',
    'http://localhost',
    'https://marked-links.vercel.app/',
  ],
}))

app.get('/', (c) => {
  return c.json({
    author: 'Carlos Costa',
    github: 'https://github.com/carllosnc/metadata-api',
    description: 'A RESTful API to get metadata from web pages',
    version: '0.0.3',
  })
})

app.get('/metadata', urlValidation, async (c) => {
  let url = c.req.query('url')

  if (url?.endsWith('/')) {
    url = url.slice(0, -1)
  }

  const metadata = await fetch(url!).then((res) => res.text())
  const $ = cheerio.load(metadata)

  const title = $('title').text()
    || $('meta[property="og:title"]').attr('content')
    || $('meta[name="twitter:title"]').attr('content')

  const description = $('meta[name="description"]').attr('content')
    || $('meta[name="twitter:description"]').attr('content')
    || $('meta[property="og:description"]').attr('content')

  const keywords = $('meta[name="keywords"]').attr('content')
  const ogImage = $('meta[property="og:image"]').attr('content')
  const twitterImage = $('meta[name="twitter:image"]').attr('content')

  const icon = $('link[rel*="icon"]').attr('href')
    || $('link[rel*="shortcut"]').attr('href')
    || $('link[rel*="apple-touch-icon"]').attr('href')
    || $('img[src*="favicon"]').attr('src')
    || $('meta[itemprop="image"]').attr('content')

  const favicon = icon ? new URL(icon, url).href : null

  return c.json({
    url: url || null,
    title: title || null,
    description: description || null,
    keywords: keywords || null,
    image: ogImage || twitterImage || null,
    favicon: favicon || null,
  })
})

export default app
