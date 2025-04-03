import SiteHeader from "@/components/site-header";

export default function SettingsPage() {
    return (
        <>
            <SiteHeader title="Einstellungen"/>
            <main className="h-full flex justify-center items-center">
                <div className="text-2xl font-bold">
                    Einstellungen
                </div>
            </main>
        </>
    )
}