import { HTTPException } from 'hono/http-exception'

export type YouTubeMetadata = {
  title: string
  url: string
  author_name: string
  author_url: string
  type?: string
  height?: number
  width?: number
  version?: string
  provider_name?: string
  provider_url?: string
  thumbnail_height?: number
  thumbnail_width?: number
  thumbnail_url?: string
  html?: string
}

export const isYouTubeUrl = (url: string): boolean => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)(\/.*)?$/;
  return youtubeRegex.test(url);
};

export async function getMetaDataFromYoutube(url: string): Promise<YouTubeMetadata> {
  let response: Response
  try {
    response = await fetch(`https://youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
  } catch (err) {
    throw new HTTPException(502, { message: `Failed to fetch YouTube metadata: ${(err as Error).message}` })
  }

  if (!response.ok) {
    throw new HTTPException(502, { message: `YouTube oEmbed responded with status ${response.status}` })
  }

  const data: YouTubeMetadata = await response.json()
  data.url = url
  return data
}
