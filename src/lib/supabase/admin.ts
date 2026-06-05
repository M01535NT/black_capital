import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client that bypasses RLS.
 * ONLY use in server-side contexts (API routes, Server Actions).
 * Never expose the service_role key to the browser.
 */
export function createAdminClient(): SupabaseClient {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
        return createMockAdminClient()
    }

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}

/**
 * Build a Supabase-shaped mock client that returns null + a friendly error
 * when env vars are missing. Lets the dev server boot without a real
 * Supabase project configured, so type errors surface in the consumer
 * rather than crashing at import time.
 *
 * The mock is typed via `unknown` and cast at the boundary — its only job
 * is to keep call-sites compiling until the env vars are wired up.
 */
function createMockAdminClient(): SupabaseClient {
    const error = Object.assign(
        new Error(
            'Supabase no configurado — configura NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en Vercel',
        ),
        { name: 'SupabaseNotConfiguredError' },
    )

    const noop = <T = null>() => Promise.resolve({ data: null as T, error })

    // Build a chainable proxy: every method returns `self` so the consumer
    // can compose `.from(...).select(...).eq(...).single()`.
    const chainable = new Proxy({} as Record<string, unknown>, {
        get(_target, prop) {
            if (prop === 'single' || prop === 'maybeSingle') return noop
            if (prop === 'then') return undefined
            return () => chainable
        },
    })

    const fromReturn = {
        select: () => chainable,
        insert: () => ({ select: () => chainable, single: noop }),
        update: () => chainable,
        delete: () => chainable,
        upsert: () => chainable,
    }

    const mock = {
        from: () => fromReturn,
        storage: {
            from: () => ({
                upload: noop,
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
                remove: noop,
                list: noop,
            }),
        },
        auth: {
            getUser: noop,
            getSession: noop,
            signOut: () => Promise.resolve({ error: null }),
        },
    }

    return mock as unknown as SupabaseClient
}
