import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const protectedPaths = ['/dashboard', '/preview', '/product', '/upload'];
  const isProtectedPath = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const response = await fetch(`${req.nextUrl.origin}/api/session`, {
      method: 'GET',
      headers: {
        Cookie: req.headers.get('cookie') || '', 
        'Content-Type': 'application/json',
      },
    });
    if(!response.ok) {
      const redirectResponse = NextResponse.redirect(new URL('login', req.url))
      redirectResponse.cookies.delete('token')
      return redirectResponse
    }
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/preview/:path*',
    '/dashboard/:path*',
    '/product/:path*',
    '/upload/:path*',
  ],
};
