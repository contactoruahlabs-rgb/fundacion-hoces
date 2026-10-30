import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-cookie-name";

// Primera línea de defensa: redirige si no hay cookie de sesión.
// La verificación real (consulta a la base de datos, expiración, usuario activo)
// ocurre en el layout del panel (src/app/admin/layout.tsx), ya que Prisma
// requiere runtime de Node y no puede ejecutarse en el Edge Runtime del middleware.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const hasSession = request.cookies.has(SESSION_COOKIE);
    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
