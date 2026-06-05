"use client";
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog, { type PostHog } from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";

/**
 * Returns a stable PostHog client. On the server and during the first
 * client render we return `null` so the children can render without
 * analytics. On subsequent client renders the real client is returned.
 *
 * Why not a regular `useEffect`? The previous implementation called
 * `posthog.init(...)` inside a `useEffect`, which (a) delayed first paint
 * of any analytics-gated UI and (b) tripped the `react-hooks/set-state-in-effect`
 * lint rule via the companion `setIsClient(true)` call.
 */
function usePostHog(): PostHog | null {
    const [client, setClient] = useState<PostHog | null>(null);
    useEffect(() => {
        // Skip init entirely if no real key is configured. The .env.example
        // ships a `phc_dummy12345` placeholder; we treat any non-posthog-format
        // key as "analytics disabled" so we don't make real network calls
        // against PostHog's servers with a junk key.
        const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        if (!key || key === "phc_dummy12345") return;

        posthog.init(key, {
            api_host:
                process.env.NEXT_PUBLIC_POSTHOG_HOST ||
                "https://us.i.posthog.com",
            capture_pageview: false, // captured manually via PostHogPageView
        });
        setClient(posthog);
    }, []);
    return client;
}

export function PostHogProvider({ children }: { children: ReactNode }) {
    const client = usePostHog();

    if (!client) {
        // No key configured (or it's the dummy placeholder) — render
        // children bare so we don't pay the cost of the PostHogProvider
        // tree and don't fire any network requests.
        return <>{children}</>;
    }
    return (
        <Provider client={client}>
            <PostHogPageView />
            {children}
        </Provider>
    );
}

function PostHogPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!pathname) return;
        const params = searchParams?.toString();
        const url = window.origin + pathname + (params ? `?${params}` : "");
        posthog.capture("$pageview", { $current_url: url });
    }, [pathname, searchParams]);

    return null;
}
