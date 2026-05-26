import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function createMockClient() {
  const noop = () => Promise.resolve({ data: null, error: new Error('No Supabase config') as any })
  const emptyArray = () => Promise.resolve({ data: [], error: null })
  const chain = (obj: any) => {
    obj.eq = () => obj
    obj.order = () => obj
    obj.limit = () => obj
    obj.not = () => obj
    obj.in = () => obj
    obj.single = noop
    return obj
  }
  const fromReturn: any = {
    select: (...args: any[]) => chain({ ...fromReturn }),
    insert: () => ({ select: () => chain({ ...fromReturn }), single: noop, data: null, error: null }),
    update: () => chain({ ...fromReturn }),
    delete: () => chain({ ...fromReturn }),
  }
  return {
    from: () => fromReturn,
    storage: { from: () => ({ upload: noop, getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
  } as any
}

export async function createClient() {
    const cookieStore = await cookies()
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!url || !key) {
        return createMockClient()
    }

    return createServerClient(
        url,
        key,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
