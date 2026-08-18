import { HTTPException } from 'hono/http-exception'

export interface TwitterApiMetadata {
  code?: number
  message?: string
  tweet?: {
    url?: string
    id?: string
    text?: string
    raw_text?: {
      text?: string
      facets?: {
        type?: string
        indices?: [number, number]
        id?: string
        display?: string
        original?: string
        replacement?: string
      }[]
    }
    author?: {
      id?: string
      name?: string
      screen_name?: string
      avatar_url?: string
      banner_url?: string
      description?: string
      location?: string
      url?: string
      followers?: number
      following?: number
      joined?: string
      likes?: number
      media_count?: number
      protected?: boolean
      website?: string | null
      tweets?: number
      avatar_color?: string | null
    }
  }
}

export function isTwitterUrl(url: string): boolean {
  return /^https?:\/\/(?:twitter|x)\.com\/\w+\/status\/\d+/.test(url)
}

export async function getMetaDataFromTwitter(url: string): Promise<TwitterApiMetadata> {
  const myUrl = new URL(url)
  let response: Response
  try {
    response = await fetch(`https://api.fxtwitter.com${myUrl.pathname}`, {
      headers: {
        'User-Agent': 'MyAwesomeBot/1.0 (+http://example.com/myawesomebot)',
      },
    })
  } catch (err) {
    throw new HTTPException(502, { message: `Failed to fetch tweet metadata: ${(err as Error).message}` })
  }

  if (!response.ok) {
    throw new HTTPException(502, { message: `fxtwitter responded with status ${response.status}` })
  }

  const data: TwitterApiMetadata = await response.json()
  return data
}

