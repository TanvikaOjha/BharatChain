import { NextRequest, NextResponse } from 'next/server';

// Server-only secret — never prefix with NEXT_PUBLIC_ or it ships to the browser.
const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_PIN_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

export async function POST(request: NextRequest) {
  if (!PINATA_JWT) {
    return NextResponse.json({ error: 'PINATA_JWT is not configured on the server' }, { status: 500 });
  }

  const incoming = await request.formData();
  const file = incoming.get('file');
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }

  const outgoing = new FormData();
  outgoing.append('file', file, (file as File).name ?? 'asset.enc');

  let pinataRes: Response;
  try {
    pinataRes = await fetch(PINATA_PIN_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${PINATA_JWT}` },
      body: outgoing,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to reach Pinata' }, { status: 502 });
  }

  if (!pinataRes.ok) {
    const text = await pinataRes.text();
    return NextResponse.json({ error: `Pinata error: ${text}` }, { status: 502 });
  }

  const { IpfsHash } = await pinataRes.json();
  return NextResponse.json({ cid: IpfsHash });
}