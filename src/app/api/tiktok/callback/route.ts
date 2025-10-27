import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { error: 'Missing authorization code' },
        { status: 400 }
      );
    }

    // Here you would call your backend API
    // For now, we'll just return success
    return NextResponse.json({ success: true, message: 'TikTok authentication successful' });
  } catch (error) {
    return NextResponse.json(
      { error: 'TikTok authentication failed' },
      { status: 500 }
    );
  }
}

