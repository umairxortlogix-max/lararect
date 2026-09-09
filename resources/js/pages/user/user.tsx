import { Head, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserRoutes from '@/routes/users';
import { useCan } from '@/hooks/use-can';

interface User {
    id: number;
    name: string;
    email: string;
    location_id?: string;
    roles: string[];
}

interface Props {
    users: User[];
    roles: string[];
}

const emptyForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    location_id: '',
    role: '',
};

export default function UserPage({ users = [], roles = [] }: Props) {
    const can = useCan();
    const canManageAccess = can('create users') || can('edit users');
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const { data, setData, post, put, processing, errors, reset } = useForm(emptyForm);

    const closeDialog = () => {
        setOpen(false);
        setEditingUser(null);
        reset();
    };

    const handleOpenCreate = () => {
        setEditingUser(null);
        reset();
        setOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            location_id: user.location_id ?? '',
            role: user.roles[0] ?? '',
        });
        setOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                onSuccess: closeDialog,
            });
            return;
        }

        post(UserRoutes.save.url(), {
            onSuccess: closeDialog,
        });
    };

    const isEditing = Boolean(editingUser);
    const handleDelete = (user: User) => {
        if (confirm('Are you sure you went to Delete this User?')) {
            router.delete(`/users/${user.id}`);
        }
    }

    return (
        <>
            <Head title="Users" />
            <div className="min-h-svh bg-[#f5f7f8] p-6">
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    <div>
                        <h1 className="text-2xl font-bold">Subaccount </h1>
                    </div>
                    {can('create users') && (
                        <div className="flex justify-end">
                            <Button onClick={handleOpenCreate}>Create Subaccount</Button>
                        </div>
                    )}

                </div>

                <div className="glass-panel overflow-hidden rounded-2xl">
                    <div className="overflow-x-auto">
                        <table className="glass-table min-w-[720px] text-sm">
                            <thead className="glass-table-header text-left">
                                <tr>
                                    <th className="px-5 py-3 font-medium">ID</th>
                                    <th className="px-5 py-3 font-medium">Name</th>
                                    <th className="px-5 py-3 font-medium">Email</th>
                                    <th className="px-5 py-3 font-medium">Location</th>
                                    <th className="px-5 py-3 font-medium">Role</th>
                                    <th className="px-5 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id} className="glass-table-row">
                                            <td className="px-5 py-4 font-medium text-[#1f2937]">#{user.id}</td>
                                            <td className="px-5 py-4 font-medium text-[#1f2937]">{user.name}</td>
                                            <td className="glass-muted px-5 py-4">{user.email}</td>
                                            <td className="px-5 py-4 text-[#475569]">{user.location_id || 'N/A'}</td>
                                            <td className="px-5 py-4"><span className="glass-badge">{user.roles.join(', ') || 'No role'}</span></td>
                                            <td className="px-5 py-4">
                                                {can('edit users') && (
                                                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(user)}>
                                                        Edit
                                                    </Button>
                                                )}
                                                {can('delete users') && (
                                                    <Button variant="outline" size="sm" onClick={() => handleDelete(user)} className="ml-2">
                                                        Delete
                                                    </Button>
                                                )}
                                                <Button variant="outline" size="sm" className="ml-2">
                                                    Login As
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="glass-muted px-5 py-10 text-center">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Dialog open={open} onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                        closeDialog();
                    }
                    setOpen(nextOpen);
                }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit User' : 'Create User'}</DialogTitle>
                        </DialogHeader>

                        <form className="grid gap-5" onSubmit={submit}>
                            <div className="grid gap-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Name
                                </label>
                                <input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Password{isEditing ? ' (optional)' : ''}
                                </label>
                                <input
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    id="password"
                                    name="password"
                                    type="password"
                                    required={!isEditing}
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="password_confirmation" className="text-sm font-medium">
                                    Confirm password{isEditing ? ' (optional)' : ''}
                                </label>
                                <input
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    required={!isEditing}
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="location" className="text-sm font-medium">
                                    Location
                                </label>
                                <input
                                    value={data.location_id}
                                    onChange={(e) => setData('location_id', e.target.value)}
                                    id="location"
                                    name="location_id"
                                    type="text"
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                                />
                                <InputError message={errors.location_id} />
                            </div>

                            {canManageAccess && <div className="grid gap-2">
                                <label htmlFor="role" className="text-sm font-medium">Role</label>
                                <select
                                    id="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                                >
                                    <option value="">No role</option>
                                    {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                                </select>
                                <InputError message={errors.role} />
                            </div>}

                            <div className="flex justify-end gap-3 pt-2">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save changes' : 'Create user')}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}