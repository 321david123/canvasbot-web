import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function createClient() {
  // Dev bypass: if DEV_USER_ID is set, use service-role client so all queries
  // work without a real auth session. Only active in local dev.
  if (process.env.DEV_USER_ID && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const client = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );

    // Patch auth.getUser() to return the dev user
    const devUserId = process.env.DEV_USER_ID;
    const origGetUser = client.auth.getUser.bind(client.auth);
    client.auth.getUser = async () => ({
      data: {
        user: {
          id: devUserId,
          email: "dev@tec.mx",
          user_metadata: { full_name: "Dev User" },
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as any,
      },
      error: null,
    });

    return client as any;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  );
}
