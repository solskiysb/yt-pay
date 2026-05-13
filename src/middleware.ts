import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// Routes that require authentication (without locale prefix)
const protectedPaths = ["/admin", "/dashboard", "/buyer"];

function isProtectedPath(pathname: string): boolean {
  // Strip locale prefix to check the actual path
  const segments = pathname.split("/").filter(Boolean);
  const locales = routing.locales as readonly string[];
  const pathWithoutLocale =
    segments.length > 0 && locales.includes(segments[0])
      ? "/" + segments.slice(1).join("/")
      : pathname;

  return protectedPaths.some(
    (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + "/")
  );
}

export async function middleware(request: NextRequest) {
  // 1. Run next-intl middleware first (handles locale detection + redirects)
  const intlResponse = intlMiddleware(request);

  // 2. For protected routes, check Supabase auth
  if (isProtectedPath(request.nextUrl.pathname)) {
    // Create a response we can modify
    const response = intlResponse || NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Extract locale from the URL for the redirect
      const segments = request.nextUrl.pathname.split("/").filter(Boolean);
      const locales = routing.locales as readonly string[];
      const locale =
        segments.length > 0 && locales.includes(segments[0])
          ? segments[0]
          : routing.defaultLocale;

      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    return response;
  }

  // 3. For non-protected routes, also refresh Supabase session (keeps cookies fresh)
  if (intlResponse) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            cookiesToSet.forEach(({ name, value, options }) =>
              intlResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Just refresh the session — don't block on it
    await supabase.auth.getUser();
  }

  return intlResponse;
}

export const config = {
  matcher: [
    // Match all pathnames except:
    // - API routes
    // - Next.js internals (_next)
    // - Static files with extensions
    "/((?!api|_next|auth|logout|.*\\..*).*)",
  ],
};
