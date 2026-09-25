import { NextRequest, NextResponse } from 'next/server';

// Server-only — no NEXT_PUBLIC_ prefix, so these never reach the browser bundle.
const KEY_MANAGER_URL = process.env.KEY_MANAGER_URL;
const KEY_MANAGER_ADMIN_API_KEY = process.env.KEY_MANAGER_ADMIN_API_KEY;

export async function POST(request: NextRequest) {
  if (!KEY_MANAGER_URL || !KEY_MANAGER_ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Key manager is not configured on the server' }, { status: 500 });
  }

  const { assetId, keyBase64 } = await request.json();
  if (!Number.isInteger(assetId) || !keyBase64) {
    return NextResponse.json({ error: 'assetId and keyBase64 are required' }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${KEY_MANAGER_URL}/keys/${assetId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KEY_MANAGER_ADMIN_API_KEY,
      },
      body: JSON.stringify({ keyBase64 }),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to reach key manager' }, { status: 502 });
  }

  const body = await res.json().catch(() => ({}));
  return NextResponse.json(body, { status: res.status });
}