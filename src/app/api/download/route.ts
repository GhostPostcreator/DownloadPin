import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mediaUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'pinterest-download';

  if (!mediaUrl) {
    return new Response('Missing URL parameters', { status: 400 });
  }

  try {
    const response = await fetch(mediaUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (!response.ok) throw new Error('Target stream response failed');

    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');

    return new NextResponse(response.body as any, { headers });
  } catch (error) {
    return new Response('Error cascading direct media stream chunk array', { status: 500 });
  }
}
