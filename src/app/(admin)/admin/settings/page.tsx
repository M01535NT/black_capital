import { requireAdminRole } from "@/lib/auth";
import { SettingsForm } from "./settings-form";

export const revalidate = 0;

export default async function SettingsPage() {
    await requireAdminRole();
    return <SettingsForm />;
}
