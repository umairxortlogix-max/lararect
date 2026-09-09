import { Link, usePage } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useCan } from '@/hooks/use-can';
import type { NavItem } from '@/types';

export function NavMain({ items }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const can = useCan();
    const { roles = [], isSuperAdmin = false } = usePage().props;
    const visibleItems = items.filter(
        (item) =>
            (!item.superAdminOnly || isSuperAdmin || roles.includes('super_admin')) &&
            (!item.permissions || can(item.permissions)),
    );

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {visibleItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            className="text-[#dcf8c6] hover:bg-[#128c7e] hover:text-white data-[active=true]:bg-[#25d366] data-[active=true]:text-[#075e54] data-[active=true]:shadow-[0_6px_18px_rgba(37,211,102,0.2)]"
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
