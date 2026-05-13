"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Contraseña incorrecta");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-foreground/10 bg-card p-6 space-y-4"
    >
      <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-gold-500/10">
        <Lock className="w-5 h-5 text-gold-500" />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground/70"
        >
          Contraseña de acceso
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoFocus
          disabled={loading}
          className="bg-muted/50"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading || !password}
        className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold"
      >
        {loading ? "Verificando..." : "Acceder"}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            BLACK <span className="text-gold-500">CORP</span>
          </h1>
          <p className="text-foreground/50 text-sm">Panel de Administración</p>
        </div>

        <Suspense
          fallback={
            <div className="rounded-xl border border-foreground/10 bg-card p-6 text-center">
              <p className="text-foreground/50">Cargando...</p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
