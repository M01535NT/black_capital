"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationItem {
  id: string;
  title: string;
  body: string | null;
  href: string | null;
  read_at: string | null;
}

export function AdminTopbarActions() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    async function load() {
      const res = await fetch("/api/admin/notifications");
      if (!res.ok || !active) return;
      const json = await res.json();
      setItems(json.notifications || []);
      setUnread(json.unreadCount || 0);
    }
    load();
    const interval = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function markAllRead() {
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setUnread(0);
    setItems((current) => current.map((item) => ({ ...item, read_at: item.read_at || new Date().toISOString() })));
  }

  return (
    <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2">
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setOpen((current) => !current)}
          className="relative h-9 w-9 rounded-full border-white/[0.12] bg-white/[0.025] text-white"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 min-w-4 bg-[var(--color-accent)] px-1 text-[10px] font-bold text-black">
              {unread}
            </span>
          )}
        </Button>
        {open && (
          <>
            <button className="fixed inset-0 z-20 cursor-default" onClick={() => setOpen(false)} aria-label="Cerrar notificaciones" />
            <div className="fixed left-3 right-3 top-16 z-30 border border-white/[0.08] bg-[#0b0b0b] shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-80">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
                <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-white">Notificaciones</p>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs text-[var(--color-accent)] hover:text-white">
                    Marcar leídas
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-auto">
                {items.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-white/45">Sin notificaciones.</p>
                ) : (
                  items.map((item) => {
                    const content = (
                      <div className={`border-b border-white/[0.06] px-4 py-3 ${item.read_at ? "bg-transparent" : "bg-[var(--color-accent)]/5"}`}>
                        <p className="text-sm font-medium text-white">{item.title}</p>
                        {item.body && <p className="mt-1 line-clamp-2 text-xs text-white/50">{item.body}</p>}
                      </div>
                    );
                    return item.href ? (
                      <Link key={item.id} href={item.href} onClick={() => setOpen(false)}>{content}</Link>
                    ) : (
                      <div key={item.id}>{content}</div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Button asChild type="button" variant="outline" size="icon" className="h-9 w-9 rounded-full border-white/[0.12] bg-white/[0.025] text-white">
        <Link href="/admin/account">
          <UserCircle className="h-4 w-4" />
          <span className="sr-only">Mi cuenta</span>
        </Link>
      </Button>
      <Button type="button" variant="outline" size="icon" onClick={logout} className="h-9 w-9 rounded-full border-white/[0.12] bg-white/[0.025] text-white">
        <LogOut className="h-4 w-4" />
        <span className="sr-only">Cerrar sesión</span>
      </Button>
    </div>
  );
}
