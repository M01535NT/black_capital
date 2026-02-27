import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client that bypasses RLS.
 * ONLY use in server-side contexts (API routes, Server Actions).
 * Never expose the service_role key to the browser.
 */
export function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
}
