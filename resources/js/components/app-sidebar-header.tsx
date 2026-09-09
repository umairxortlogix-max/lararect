import { Bell, Search } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const initials = user?.name
        ?.split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <header className="flex min-h-16 shrink-0 flex-wrap items-center gap-4 border-b border-[#e5e7eb] bg-white/90 px-4 py-3 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-14 md:px-6">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-4">
                <label className="relative hidden w-48 items-center md:flex lg:w-64">
                    <Search className="absolute left-3 size-4 text-[#6b7280]" />
                    <input
                        type="search"
                        placeholder="Search anything..."
                        aria-label="Search dashboard"
                        className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f5f7f8] pl-10 pr-3 text-sm text-[#1f2937] outline-none placeholder:text-[#6b7280] focus:border-[#25d366] focus:ring-2 focus:ring-[#25d366]/10"
                    />
                </label>
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative flex size-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-[#6b7280] transition-colors hover:border-[#25d366] hover:text-[#075e54]"
                >
                    <Bell className="size-[18px]" />
                    <span className="absolute top-2 right-2 size-1.5 rounded-full bg-[#25d366] shadow-[0_0_8px_#25d366]" />
                </button>
                <div className="hidden items-center gap-3 border-l border-[#e5e7eb] pl-4 sm:flex">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#25d366] text-xs font-semibold text-white shadow-[0_0_16px_rgba(37,211,102,0.2)]">
                        {initials || 'AD'}
                    </div>
                    <div className="hidden leading-tight lg:block">
                        <p className="max-w-28 truncate text-sm font-medium text-white">
                            {user?.name || 'Admin'}
                        </p>
                        <p className="text-xs text-[#6b7280]">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
