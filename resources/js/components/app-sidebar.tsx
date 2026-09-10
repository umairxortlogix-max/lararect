import { Link } from '@inertiajs/react';
import {
    FolderGit2,
    LayoutDashboard,
    Package,
    Settings2,
    ShieldCheck,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, products, users } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
        permissions: 'view dashboard',
    },
    {
        title: 'Products',
        href: products(),
        icon: Package,
        permissions: 'view products',
    },
    {
        title: 'Contact',
        href: '/contact',
        icon: Users,
        permissions: 'view contact'
    },
    {
        title: 'Users',
        href: users(),
        icon: Users,
        permissions: 'view users'
    },
    {
        title: 'Permissions',
        href: '/permissions',
        icon: ShieldCheck,
        permissions: 'view permissions',
        superAdminOnly: true,
    },
    {
        title: 'Settings',
        href: '/settings/info',
        icon: Settings2,
        permissions: 'view settings',
    }
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: FolderGit2,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-[#075e54] bg-[#075e54] text-[#dcf8c6] shadow-[10px_0_35px_rgba(7,94,84,0.16)] [&_[data-sidebar=sidebar]]:border-[#075e54] [&_[data-sidebar=sidebar]]:bg-[#075e54] [&_[data-sidebar=sidebar]]:text-[#dcf8c6]"
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
