import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = {
    children: ReactNode;
    variant?: AppVariant;
};

export function AppShell({ children, variant = 'sidebar' }: Props) {
    const isOpen = usePage().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">{children}</div>
        );
    }

    return (
        <SidebarProvider
            defaultOpen={isOpen}
            className="[--background:#f5f7f8] [--foreground:#1f2937] [--sidebar:#075e54] [--sidebar-foreground:#dcf8c6] [--sidebar-primary:#25d366] [--sidebar-primary-foreground:#ffffff] [--sidebar-accent:#128c7e] [--sidebar-accent-foreground:#ffffff] [--sidebar-border:rgba(220,248,198,0.18)] [--sidebar-ring:#25d366] bg-[#f5f7f8] text-[#1f2937]"
        >
            {children}
        </SidebarProvider>
    );
}
