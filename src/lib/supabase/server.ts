import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// In dev we always "log in" as someone so you never see the login page.
const DEV_PLACEHOLDER_ID = "00000000-0000-0000-0000-000000000000";

function fakeUser(id: string) {
  return {
    id,
    email: "dev@tec.mx",
    user_metadata: { full_name: "Dev User" },
    app_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as any;
}

export async function createClient() {
  const isDev = process.env.NODE_ENV === "development";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  // Dev: use service-role so queries work; fake user so no login needed.
  if (isDev && url && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const client = createSupabaseClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
    const userId = process.env.DEV_USER_ID || DEV_PLACEHOLDER_ID;
    client.auth.getUser = async () => ({ data: { user: fakeUser(userId) }, error: null });
    return client as any;
  }

  // Dev without service role: fake user so dashboard renders (data empty until you set SUPABASE_SERVICE_ROLE_KEY + DEV_USER_ID).
  if (isDev && url && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const anon = createSupabaseClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    anon.auth.getUser = async () => ({ data: { user: fakeUser(DEV_PLACEHOLDER_ID) }, error: null });
    return anon as any;
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
