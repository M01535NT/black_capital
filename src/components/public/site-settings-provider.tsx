"use client";

import { createContext, useContext, type ReactNode } from "react";
import { contactFromSettings, DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/site-settings-schema";

const PublicSettingsContext = createContext({ contact: contactFromSettings(DEFAULT_SITE_SETTINGS), readOnly: false });

export function PublicSettingsProvider({ settings, readOnly = false, children }: { settings: SiteSettings; readOnly?: boolean; children: ReactNode }) {
  return <PublicSettingsContext.Provider value={{ contact: contactFromSettings(settings), readOnly }}>{children}</PublicSettingsContext.Provider>;
}
export function usePublicContact() { return useContext(PublicSettingsContext).contact; }
export function useReadOnlyPreview() { return useContext(PublicSettingsContext).readOnly; }
