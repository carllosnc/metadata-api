import { Hono } from 'hono'
import { urlValidation } from './middlewares/validation'
import { csrf } from 'hono/csrf'
import { cors } from 'hono/cors'
import { getMetaDataFromAnySite } from './providers/any-site';
import { getMetaDataFromYoutube } from './providers/youtube';
import { isYouTubeUrl } from "./providers/youtube";
import { getMetaDataFromTwitter, isTwitterUrl } from './providers/twitter';

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.use(csrf())

app.use('*', cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost',
    'https://marked-links.vercel.app',
    'https://fav-links.vercel.app',
    'https://favs.carlosnc.site',
  ],
  allowMethods: ['GET', 'OPTIONS'],
}))

app.get('/', (c) => {
  return c.json({
    author: 'Carlos Costa',
    github: 'https://github.com/carllosnc/metadata-api',
    description: 'A RESTful API to get metadata from web pages',
    version: '0.0.5',
  })
})

app.get('/metadata', urlValidation, async (c) => {
  let url = c.req.query('url')

  if (isYouTubeUrl(url!)) {
    return c.json(await getMetaDataFromYoutube(url!))
  }

  if (isTwitterUrl(url!)) {
    return c.json(await getMetaDataFromTwitter(url!))
  }

  return c.json(await getMetaDataFromAnySite(url!))
})

export default app
