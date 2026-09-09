import { Head } from '@inertiajs/react';

export default function SettingsPage() {
    return (
        <>
            <Head title="Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto bg-transparent p-4 sm:p-6">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#35cfff]/20 bg-[rgba(20,65,95,0.55)] shadow-[0_14px_34px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(53,207,255,0.12),transparent_45%)]" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#35cfff]/20 bg-[rgba(20,65,95,0.55)] shadow-[0_14px_34px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(21,159,229,0.14),transparent_45%)]" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#35cfff]/20 bg-[rgba(20,65,95,0.55)] shadow-[0_14px_34px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(8,120,201,0.16),transparent_48%)]" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-2xl border border-[#35cfff]/20 bg-[rgba(20,65,95,0.55)] shadow-[0_18px_45px_rgba(0,0,0,0.18)] backdrop-blur-xl md:min-h-min">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(53,207,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(53,207,255,0.04)_1px,transparent_1px)] bg-[size:36px_36px]" />
                </div>
            </div>
        </>
    );
}

SettingsPage.layout = {
    breadcrumbs: [
        {
            title: 'Settings',
            // href: settings/in(),
        },
    ],
};
