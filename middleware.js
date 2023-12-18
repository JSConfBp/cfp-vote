export { default } from 'next-auth/middleware';

// Temporarily configure every page to be protected by Azure AD login
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - favicon.ico (favicon file)
     */
    '/((?!api/live|api/ready|favicon.ico).*)',
  ],
};
