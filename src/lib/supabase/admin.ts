import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client that bypasses RLS.
 * ONLY use in server-side contexts (API routes, Server Actions).
 * Never expose the service_role key to the browser.
 */
export function createAdminClient() {
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

function createMockAdminClient() {
    const noop = () => Promise.resolve({ data: null, error: new Error('Supabase no configurado — configura NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en Vercel') as any })
    const chain = (obj: any) => {
        obj.eq = () => obj
        obj.order = () => obj
        obj.limit = () => obj
        obj.not = () => obj
        obj.in = () => obj
        obj.select = (...args: any[]) => chain({ ...obj })
        obj.single = noop
        return obj
    }
    const fromReturn: any = {
        select: (...args: any[]) => chain({ ...fromReturn }),
        insert: () => ({ select: () => chain({ ...fromReturn }), single: noop }),
        update: () => chain({ ...fromReturn }),
        delete: () => chain({ ...fromReturn }),
    }
    return {
        from: () => fromReturn,
        storage: { from: () => ({ upload: noop, getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
    } as any
}
