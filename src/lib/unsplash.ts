export interface UnsplashPhoto {
  id: string;
  urls: { regular: string; small: string; thumb: string };
  alt_description: string | null;
  description: string | null;
  user: { name: string; username: string; links: { html: string } };
  links: { html: string };
}

export async function searchUnsplash(
  query: string,
  accessKey: string,
  orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape'
): Promise<UnsplashPhoto | null> {
  if (!accessKey) return null;

  try {
    const url = new URL('https://api.unsplash.com/search/photos');
    url.searchParams.set('query', query);
    url.searchParams.set('per_page', '1');
    url.searchParams.set('orientation', orientation);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });

    if (!res.ok) return null;
    const data = await res.json() as { results: UnsplashPhoto[] };
    return data.results?.[0] ?? null;
  } catch {
    return null;
  }
}
