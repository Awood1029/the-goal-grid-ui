import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/"];

export function middleware(request: NextRequest) {
	const token = request.cookies.get("token");
	const { pathname } = request.nextUrl;

	// Allow access to public routes
	if (publicRoutes.includes(pathname)) {
		return NextResponse.next();
	}

	// Redirect to login if no token is present
	if (!token) {
		const loginUrl = new URL("/login", request.url);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
