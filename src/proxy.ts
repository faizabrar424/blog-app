import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('access_token');

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jose.jwtVerify(token.value, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/post/create', '/post/:id/edit'],
};
