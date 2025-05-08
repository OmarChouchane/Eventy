import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// 👇 Define your public routes using the new route matcher
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/events/(.*)',
  '/api/webhook/clerk',
  '/api/webhook/stripe',
  '/api/webhook/uploadThing',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  const { nextUrl } = req;

// Skip authentication for API routes that handle their own auth
if (nextUrl.pathname.startsWith('/api/uploadthing') ||
nextUrl.pathname.startsWith('/api/groups')) {
return;
}



  // Allow access to public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If user is not signed in, redirect to sign-in
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Authenticated access
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
