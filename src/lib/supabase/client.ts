import { createBrowserClient } from '@supabase/ssr'

function createMockClient() {
  if (typeof window === "undefined") {
    console.warn("[Supabase] createMockClient: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY not set");
  }
  const noop = () => Promise.resolve({ data: null, error: new Error("No Supabase config") })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock chainer simulates Supabase fluent API
  const chain = (obj: any) => {
    obj.eq = () => obj
    obj.order = () => obj
    obj.limit = () => obj
    obj.not = () => obj
    obj.in = () => obj
    obj.single = noop
    return obj
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock return type mimics Supabase query builder
  const fromReturn: any = {
    select: () => chain({ ...fromReturn }),
    insert: () => ({ select: () => chain({ ...fromReturn }), single: noop, data: null, error: null }),
    update: () => chain({ ...fromReturn }),
    delete: () => chain({ ...fromReturn }),
  }
  return {
    from: () => fromReturn,
    storage: { from: () => ({ upload: noop, getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
  } as never
}

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!url || !key) {
        return createMockClient()
    }

    return createBrowserClient(url, key)
}

// Singleton for client components — use this instead of createClient()
// to avoid creating new instances on every render.
export const supabase = createClient()
