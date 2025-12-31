import * as cheerio from 'cheerio';

export type SiteMetaData = {
  url: string | null;
  title: string | null;
  description: string | null;
  keywords: string | null;
  image: string | null;
  favicon: string | null;
};

export async function getMetaDataFromAnySite(url: string): Promise<SiteMetaData> {
  if (url?.endsWith('/')) {
    url = url.slice(0, -1);
  }

  const headContent = await fetch(url!).then(res => res.text());
  const $ = cheerio.load(headContent);

  let title = $('head > title').text()
    || $('meta[property="og:title"]').attr('content')
    || $('meta[name="twitter:title"]').attr('content')
    || url;

  const description = $('meta[name="description"]').attr('content')
    || $('meta[name="twitter:description"]').attr('content')
    || $('meta[property="og:description"]').attr('content');

  const keywords = $('meta[name="keywords"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const twitterImage = $('meta[name="twitter:image"]').attr('content');

  const icon = $('link[rel*="icon"]').attr('href')
    || $('link[rel*="shortcut"]').attr('href')
    || $('link[rel*="apple-touch-icon"]').attr('href')
    || $('img[src*="favicon"]').attr('src')
    || $('meta[itemprop="image"]').attr('content');

  const favicon = icon ? new URL(icon, url).href : null;

  return {
    url: url || null,
    title: title || null,
    description: description || null,
    keywords: keywords || null,
    image: ogImage || twitterImage || null,
    favicon: favicon || null,
  };
}

