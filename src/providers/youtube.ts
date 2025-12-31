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
  const response = await fetch(`https://youtube.com/oembed?url=${url}&format=json`)
  const data: YouTubeMetadata = await response.json()
  data.url = url
  return data
}

