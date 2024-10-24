import { NextResponse } from "next/server";
export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Allow access to signin and signup pages even without a token
  if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
    return NextResponse.next();
  }
  // Redirect to signin page if no token is present
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  // Allow access to all other pages if token is present
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
