import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const pathname = req.nextUrl.pathname;
        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin';
        }
        if (pathname.startsWith('/account')) {
          return !!token;
        }
        return true;
      },
    },
  },
);

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
