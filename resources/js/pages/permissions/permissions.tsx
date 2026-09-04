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

            <div className="p-6">
                <div className="mx-auto w-full max-w-4xl">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-200">
                            Roles & Permissions
                        </h1>

                        <p className="mt-1 text-sm text-gray-400">
                            Manage permissions for each role.
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">
                        {/* Role Selection */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Select Role
                            </label>

                            <select
                                value={selectedRole?.id ?? ''}
                                onChange={(e) =>
                                    handleRoleChange(
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-200 focus:border-blue-500 focus:outline-none"
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
                            <h2 className="mb-4 text-lg font-semibold text-gray-200">
                                Permissions
                            </h2>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {permissions.map((permission) => (
                                    <label
                                        key={permission.id}
                                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 p-4 hover:bg-gray-750"
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
                                            className="h-4 w-4 rounded"
                                        />

                                        <span className="text-sm text-gray-200">
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
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Saving...'
                                    : 'Save Permissions'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-xl border border-gray-700 bg-gray-900">
                        <div className="border-b border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-200">
                                User Sidebar Access
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Sidebar menus available through each user's role.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] text-left text-sm">
                                <thead className="border-b border-gray-700 bg-gray-800 text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">User</th>
                                        <th className="px-6 py-3 font-medium">Role</th>
                                        <th className="px-6 py-3 font-medium">Visible Menus</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {users.map((user) => {
                                        const menus = [
                                            ['Dashboard', 'view dashboard'],
                                            ['Products', 'view products'],
                                            ['Users', 'view users'],
                                            ['Permissions', 'view permissions'],
                                            ['Settings', 'view settings'],
                                        ].filter(([, permission]) => user.permissions.includes(permission));

                                        return (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-200">{user.name}</div>
                                                    <div className="text-gray-400">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-300">
                                                    {user.roles.join(', ') || 'No role'}
                                                </td>
                                                <td className="px-6 py-4 text-gray-300">
                                                    {menus.map(([menu]) => menu).join(', ') || 'No menu access'}
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