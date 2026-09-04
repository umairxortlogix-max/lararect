import { usePage } from '@inertiajs/react';

export function useCan() {
    const page = usePage().props;
    const permissions = page.permissions ?? page.auth?.permissions ?? [];
    const roles = page.roles ?? page.auth?.roles ?? [];
    const isSuperAdmin = page.isSuperAdmin || roles.includes('super_admin');

    return (permission: string) =>
        isSuperAdmin ||
        permissions.includes(permission);
}