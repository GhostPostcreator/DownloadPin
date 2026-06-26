import { NextRequest, NextResponse } from 'next/server';
import { PinterestMediaResponse, MediaVariant } from '@/types';

// Simple in-memory rate limiting map (Production architectures should use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 15;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  record.count++;
  return record.count > maxRequests;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'anonymous';
    if (isRateLimited(ip)) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'A valid Pinterest URL is required.' }, { status: 400 });
    }

    // URL Sanitization and Normalization
    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    try {
      const parsedUrl = new URL(normalizedUrl);
      const host = parsedUrl.hostname.replace('www.', '');
      if (!['pinterest.com', 'pin.it', 'pinterest.ca', 'pinterest.co.uk', 'pinterest.fr', 'pinterest.de'].some(d => host.endsWith(d))) {
        return NextResponse.json({ success: false, error: 'Invalid URL source. Only public Pinterest links are supported.' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ success: false, error: 'Malformed URL provided.' }, { status: 400 });
    }

    // Resolve Shortened Links (pin.it)
    let finalUrl = normalizedUrl;
    if (finalUrl.includes('pin.it')) {
      const res = await fetch(finalUrl, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      finalUrl = res.url;
    }

    // Fetch the target public target page
    const htmlResponse = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!htmlResponse.ok) {
      return NextResponse.json({ success: false, error: 'Failed to access the public Pin metadata. Verify the link is accessible without a login.' }, { status: 404 });
    }

    const html = await htmlResponse.text();
    
    // Parse the core application state script tag
    const scriptRegex = /<script id="__PWS_DATA__" type="application\/json">([\s\S]*?)<\/script>/;
    const match = html.match(scriptRegex);
    
    let title = 'Pinterest Media';
    let mediaType: 'image' | 'video' | 'gif' = 'image';
    let variants: MediaVariant[] = [];
    let previewImage = '';

    if (match && match[1]) {
      const jsonData = JSON.parse(match[1]);
      const pinData = jsonData?.props?.initialState?.pins;
      const pinId = Object.keys(pinData || {})[0];
      const details = pinData?.[pinId];

      if (details) {
        title = details.title || details.description || 'Pinterest Media';
        
        // Match Media Content
        if (details.videos?.video_list) {
          mediaType = 'video';
          const vList = details.videos.video_list;
          const matchedVariants: MediaVariant[] = [];
          
          if (vList.V_HLSV4?.url) {
            matchedVariants.push({ url: vList.V_HLSV4.url, quality: 'Original', resolution: 'Adaptive Stream', format: 'mp4' });
          }
          if (vList.V_720P?.url) {
            matchedVariants.push({ url: vList.V_720P.url, quality: 'Full HD', resolution: '720p', format: 'mp4' });
          }
          if (vList.V_540P?.url) {
            matchedVariants.push({ url: vList.V_540P.url, quality: 'HD', resolution: '540p', format: 'mp4' });
          }
          variants = matchedVariants;
          previewImage = details.images?.['736x']?.url || details.images?.originals?.url || '';
        } else if (details.images) {
          previewImage = details.images.originals?.url || '';
          const isGif = previewImage.toLowerCase().endsWith('.gif');
          mediaType = isGif ? 'gif' : 'image';

          variants.push({
            url: previewImage,
            quality: 'Original',
            resolution: `${details.images.originals?.width || 'Auto'}x${details.images.originals?.height || 'Auto'}`,
            format: isGif ? 'gif' : 'jpg',
            sizeText: 'Original Quality'
          });

          if (details.images['736x']?.url) {
            variants.push({
              url: details.images['736x'].url,
              quality: 'Standard',
              resolution: `${details.images['736x'].width}x${details.images['736x'].height}`,
              format: 'jpg',
              sizeText: 'Compressed'
            });
          }
        }
      }
    }

    // Elegant Fallback Parsing Model via OpenGraph Tags if deep script injection context is missing
    if (variants.length === 0) {
      const ogVideo = html.match(/<meta property="og:video" content="([^"]+)"/)?.[1];
      const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
      const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1];

      if (ogTitle) title = ogTitle;
      if (ogImage) previewImage = ogImage;

      if (ogVideo) {
        mediaType = 'video';
        variants.push({ url: ogVideo, quality: 'Original', resolution: '720p', format: 'mp4' });
      } else if (ogImage) {
        mediaType = ogImage.toLowerCase().endsWith('.gif') ? 'gif' : 'image';
        variants.push({ url: ogImage, quality: 'Original', resolution: 'Original', format: mediaType === 'gif' ? 'gif' : 'jpg' });
      }
    }

    if (variants.length === 0) {
      return NextResponse.json({ success: false, error: 'Could not find any public downloadable media streams on this page.' }, { status: 422 });
    }

    const payload: PinterestMediaResponse = {
      success: true,
      originalUrl: url,
      resolvedUrl: finalUrl,
      mediaType,
      title,
      previewImage,
      variants
    };

    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'An internal engine processing fault occurred.' }, { status: 500 });
  }
}
