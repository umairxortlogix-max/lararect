import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface UserAccess {
    id: number;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
}

interface Props {
    permissions: Permission[];
    roles: Role[];
    users: UserAccess[];
}

export default function PermissionsPage({
    permissions,
    roles,
    users,
}: Props) {
    const [selectedRole, setSelectedRole] = useState<Role | null>(
        roles[0] ?? null
    );

    const { data, setData, post, processing } = useForm({
        role_id: roles[0]?.id ?? '',
        permissions: roles[0]?.permissions.map(
            (permission) => permission.id
        ) ?? [],
    });

    const handleRoleChange = (roleId: number) => {
        const role = roles.find((role) => role.id === roleId);

        if (!role) {
            return;
        }

        setSelectedRole(role);

        setData({
            role_id: role.id,
            permissions: role.permissions.map(
                (permission) => permission.id
            ),
        });
    };

    const handlePermissionChange = (
        permissionId: number,
        checked: boolean
    ) => {
        if (checked) {
            setData('permissions', [
                ...data.permissions,
                permissionId,
            ]);
        } else {
            setData(
                'permissions',
                data.permissions.filter(
                    (id) => id !== permissionId
                )
            );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/permissions/update', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Permissions" />

            <div className="min-h-svh bg-[#f5f7f8] p-6">
                <div className="mx-auto w-full max-w-4xl">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold tracking-tight text-[#075e54]">
                            Roles & Permissions
                        </h1>

                        <p className="mt-1 text-sm text-[#128c7e]">
                            Manage permissions for each role.
                        </p>
                    </div>

                    <div className="glass-panel rounded-2xl p-6">
                        {/* Role Selection */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-[#1f2937]">
                                Select Role
                            </label>

                            <select
                                value={selectedRole?.id ?? ''}
                                onChange={(e) =>
                                    handleRoleChange(
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full rounded-xl border border-[#bbf7d0] bg-white px-4 py-2.5 text-[#1f2937] outline-none transition focus:border-[#25d366] focus:ring-2 focus:ring-[#25d366]/10"
                            >
                                {roles.map((role) => (
                                    <option
                                        key={role.id}
                                        value={role.id}
                                    >
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Permissions */}
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-[#1f2937]">
                                Permissions
                            </h2>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {permissions.map((permission) => (
                                    <label
                                        key={permission.id}
                                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#bbf7d0] bg-[#f9fefb] p-4 transition-colors hover:border-[#25d366] hover:bg-[#f0fdf4]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.includes(
                                                permission.id
                                            )}
                                            onChange={(e) =>
                                                handlePermissionChange(
                                                    permission.id,
                                                    e.target.checked
                                                )
                                            }
                                            className="h-4 w-4 rounded border-[#25d366] text-[#25d366]"
                                        />

                                        <span className="text-sm text-[#1f2937]">
                                            {permission.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Save */}
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing || !selectedRole}
                                className="rounded-xl bg-[#25d366] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(37,211,102,0.22)] transition hover:bg-[#1fbf5d] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Saving...'
                                    : 'Save Permissions'}
                            </button>
                        </div>
                    </div>

                    <div className="glass-panel mt-6 overflow-hidden rounded-2xl">
                        <div className="border-b border-[#bbf7d0] p-6">
                            <h2 className="text-lg font-semibold text-[#1f2937]">
                                User Sidebar Access
                            </h2>
                            <p className="mt-1 text-sm text-[#6b7280]">
                                Sidebar menus available through each user's role.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="glass-table min-w-[720px] text-left text-sm">
                                <thead className="glass-table-header">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">User</th>
                                        <th className="px-6 py-3 font-medium">Role</th>
                                        <th className="px-6 py-3 font-medium">Visible Menus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => {
                                        const menus = [
                                            ['Dashboard', 'view dashboard'],
                                            ['Products', 'view products'],
                                            ['Users', 'view users'],
                                            ['Permissions', 'view permissions'],
                                            ['Settings', 'view settings'],
                                        ].filter(([, permission]) => user.permissions.includes(permission));

                                        return (
                                            <tr key={user.id} className="glass-table-row">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-[#1f2937]">{user.name}</div>
                                                    <div className="glass-muted">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-[#475569]">
                                                    <span className="glass-badge">
                                                        {user.roles.join(', ') || 'No role'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-[#475569]">
                                                    <div className="flex flex-wrap gap-2">
                                                        {menus.length > 0 ? menus.map(([menu]) => (
                                                            <span key={menu} className="rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-2.5 py-1 text-xs text-[#128c7e]">
                                                                {menu}
                                                            </span>
                                                        )) : <span className="glass-muted">No menu access</span>}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}