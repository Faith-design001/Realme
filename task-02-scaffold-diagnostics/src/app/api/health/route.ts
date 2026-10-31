import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app_name: 'RealMe',
    timestamp: new Date().toISOString(),
    service: 'realme-web-core',
  });
}

