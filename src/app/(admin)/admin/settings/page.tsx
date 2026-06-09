"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Image as ImageIcon, Type, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-ui";

interface AppSettings {
    heroVideoUrl: string;
    heroImageUrl: string;
    luxuryHeroTitle: string;
    luxuryHeroSubtitle: string;
    businessHeroTitle: string;
    businessHeroSubtitle: string;
    industrialHeroTitle: string;
    industrialHeroSubtitle: string;
    contactPhone: string;
    contactEmail: string;
    contactAddress: string;
    whatsAppTemplate: string;
}

const STORAGE_KEY = "black-capital-settings";
const LEGACY_STORAGE_KEY = "black-corporativo-settings";

const DEFAULTS: AppSettings = {
    heroVideoUrl: "",
    heroImageUrl: "",
    luxuryHeroTitle: "Black Luxury",
    luxuryHeroSubtitle: "Propiedades de lujo",
    businessHeroTitle: "Black Business",
    businessHeroSubtitle: "Espacios comerciales",
    industrialHeroTitle: "Black Industrial",
    industrialHeroSubtitle: "Naves y bodegas",
    contactPhone: "+52 (664) 000 0000",
    contactEmail: "contacto@blackmx.vercel.app",
    contactAddress: "Tijuana, Baja California, México",
    whatsAppTemplate: "Hola, estoy interesado en sus servicios.",
};

function loadFromStorage(): AppSettings {
    if (typeof window === "undefined") return DEFAULTS;
    try {
        const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        if (raw) {
            const settings = { ...DEFAULTS, ...JSON.parse(raw) };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            return settings;
        }
    } catch {}
    return DEFAULTS;
}

function saveToStorage(settings: AppSettings) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    setSettings({ ...DEFAULTS, ...data });
                    saveToStorage({ ...DEFAULTS, ...data });
                } else {
                    setSettings(loadFromStorage());
                }
            } catch {
                setSettings(loadFromStorage());
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const update = (key: keyof AppSettings, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                const data = await res.json();
                setSettings({ ...DEFAULTS, ...data });
                saveToStorage({ ...DEFAULTS, ...data });
            } else {
                saveToStorage(settings);
            }
            setSaved(true);
        } catch {
            saveToStorage(settings);
            setSaved(true);
        } finally {
            setSaving(false);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--color-accent)]" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <AdminPageHeader
                eyebrow="Sistema"
                title="Configuración"
                description="Personaliza contenido, contacto y mensajes operativos del sitio."
            />

            {/* Hero */}
            <Card className="rounded-none border-white/[0.08] bg-white/[0.025]">
                <CardHeader className="flex flex-row items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-[var(--color-accent)]" />
                    <CardTitle>Hero Homepage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-body-sm font-medium mb-1 block">URL de Video (Hero)</label>
                        <Input
                            placeholder="https://youtube.com/embed/..."
                            value={settings.heroVideoUrl}
                            onChange={e => update("heroVideoUrl", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-body-sm font-medium mb-1 block">URL de Imagen (Hero fallback)</label>
                        <Input
                            placeholder="https://..."
                            value={settings.heroImageUrl}
                            onChange={e => update("heroImageUrl", e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Brand Pages */}
            <Card className="rounded-none border-white/[0.08] bg-white/[0.025]">
                <CardHeader className="flex flex-row items-center gap-3">
                    <Type className="w-5 h-5 text-[var(--color-accent)]" />
                    <CardTitle>Títulos de Marcas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {([
                        { keyTitle: "luxuryHeroTitle", keySubtitle: "luxuryHeroSubtitle", label: "Black Luxury" },
                        { keyTitle: "businessHeroTitle", keySubtitle: "businessHeroSubtitle", label: "Black Business" },
                        { keyTitle: "industrialHeroTitle", keySubtitle: "industrialHeroSubtitle", label: "Black Industrial" },
                    ] satisfies Array<{ keyTitle: keyof AppSettings; keySubtitle: keyof AppSettings; label: string }>).map((brand) => (
                        <div key={brand.label} className="space-y-3 border border-white/[0.08] bg-background/70 p-4">
                            <p className="text-caption text-[var(--color-accent)]">{brand.label}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-body-sm font-medium mb-1 block">Título</label>
                                    <Input
                                        value={String(settings[brand.keyTitle] ?? "")}
                                        onChange={e => update(brand.keyTitle, e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-body-sm font-medium mb-1 block">Subtítulo</label>
                                    <Input
                                        value={String(settings[brand.keySubtitle] ?? "")}
                                        onChange={e => update(brand.keySubtitle, e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Contact */}
            <Card className="rounded-none border-white/[0.08] bg-white/[0.025]">
                <CardHeader className="flex flex-row items-center gap-3">
                    <Phone className="w-5 h-5 text-[var(--color-accent)]" />
                    <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-body-sm font-medium mb-1 block flex items-center gap-2">
                                <Phone className="w-3 h-3 text-[var(--color-accent)]" /> Teléfono
                            </label>
                            <Input
                                value={settings.contactPhone}
                                onChange={e => update("contactPhone", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-body-sm font-medium mb-1 block flex items-center gap-2">
                                <Mail className="w-3 h-3 text-[var(--color-accent)]" /> Correo
                            </label>
                            <Input
                                value={settings.contactEmail}
                                onChange={e => update("contactEmail", e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-body-sm font-medium mb-1 block flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-[var(--color-accent)]" /> Dirección
                        </label>
                        <Textarea
                            value={settings.contactAddress}
                            onChange={e => update("contactAddress", e.target.value)}
                            className="h-20"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* WhatsApp */}
            <Card className="rounded-none border-white/[0.08] bg-white/[0.025]">
                <CardHeader className="flex flex-row items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-[var(--color-accent)]" />
                    <CardTitle>Plantilla WhatsApp</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-body-sm font-medium mb-1 block">Mensaje predeterminado</label>
                        <Textarea
                            value={settings.whatsAppTemplate}
                            onChange={e => update("whatsAppTemplate", e.target.value)}
                            className="h-24"
                            placeholder="Hola, estoy interesado en..."
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-4">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="brushed-gold rounded-full font-bold"
                >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Guardar Configuración
                </Button>
                {saved && (
                    <span className="text-caption text-emerald-500">Configuración guardada correctamente.</span>
                )}
            </div>
        </div>
    );
}
