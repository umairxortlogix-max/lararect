
import { Button } from '@/components/ui/button';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useCan } from '@/hooks/use-can';

interface Setting {
    key: string;
    value: string;
}

interface Props {
    settings: Setting[];
    isSuperAdmin: boolean;
}

export default function SettingsPage({ settings = [], isSuperAdmin }: Props) {
    const can = useCan();
    const canViewSettings = can('view settings');
    const canEditSettings = can('edit settings');
    const getSettingValue = (key: string) => {
        return settings.find((setting) => setting.key === key)?.value || '';
    };

    const savedDashboardImage = getSettingValue('dashboard_image');
    const savedDashboardImageUrl = savedDashboardImage
        ? savedDashboardImage.startsWith('http')
            ? savedDashboardImage
            : `/storage/${savedDashboardImage}`
        : null;
    const [imagePreview, setImagePreview] = useState<string | null>(savedDashboardImageUrl);

    const { data, setData, post, processing, errors } = useForm({
        settings: {
            client_id: getSettingValue('client_id'),
            client_secret: getSettingValue('client_secret'),
            dashboard_image: null as File | null,
        },
    });

    useEffect(() => {
        setImagePreview(savedDashboardImageUrl);
    }, [savedDashboardImageUrl]);

    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/settings/store', {
            preserveScroll: true,
            forceFormData: true,
        });
    };
    const handleSubmitimage = (e: React.FormEvent) => {
        e.preventDefault();

        post('/settings/store', {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Settings" />

            <div className="flex h-full flex-1 flex-col overflow-x-auto p-4">
                <div className="mx-auto w-full max-w-3xl">
                    {isSuperAdmin && (
                        <>
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-200">
                                    GHL Credentials
                                </h1>

                                <p className="mt-1 text-sm text-gray-400">
                                    Configure your GoHighLevel API credentials.
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-600 bg-gray-800 shadow-sm">

                                <div className="border-b border-gray-600 px-6 py-5">
                                    <h2 className="text-lg font-semibold text-gray-200">
                                        API Configuration
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 p-6">

                                    {/* Client ID */}
                                    <div>
                                        <label
                                            htmlFor="client_id"
                                            className="mb-2 block text-sm font-medium text-gray-200"
                                        >
                                            Client ID
                                        </label>

                                        <input
                                            type="text"
                                            id="client_id"
                                            value={data.settings.client_id}
                                            onChange={(e) =>
                                                setData('settings', {
                                                    ...data.settings,
                                                    client_id: e.target.value,
                                                })
                                            }
                                            placeholder="Enter client ID"
                                            className="block w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                        />

                                        {errors['settings.client_id'] && (
                                            <p className="mt-1.5 text-sm text-red-500">
                                                {errors['settings.client_id']}
                                            </p>
                                        )}
                                    </div>

                                    {/* Client Secret */}
                                    <div>
                                        <label
                                            htmlFor="client_secret"
                                            className="mb-2 block text-sm font-medium text-gray-200"
                                        >
                                            Client Secret
                                        </label>

                                        <input
                                            type="text"
                                            id="client_secret"
                                            value={data.settings.client_secret}
                                            onChange={(e) =>
                                                setData('settings', {
                                                    ...data.settings,
                                                    client_secret: e.target.value,
                                                })
                                            }
                                            placeholder="Enter client secret"
                                            className="block w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                        />

                                        {errors['settings.client_secret'] && (
                                            <p className="mt-1.5 text-sm text-red-500">
                                                {errors['settings.client_secret']}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end border-t border-gray-600 pt-5">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            {processing ? 'Saving...' : 'Save Settings'}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </>
                    )}

                    {canViewSettings && <div className="rounded-xl border border-gray-600 bg-gray-800 shadow-sm mt-6">
                        <div className="border-b border-gray-600 px-6 py-5">
                            <h2 className="text-lg font-semibold text-gray-200">
                                Dashboard Image
                            </h2>
                            <form onSubmit={handleSubmitimage} className="space-y-6 p-6">
                                <label
                                    htmlFor="dashboard_image"
                                    className="mb-2 block text-sm font-medium text-gray-200"
                                >
                                    Dashboard Image
                                </label>

                                {canEditSettings && <input
                                    type="file"
                                    id="dashboard_image"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setImagePreview(URL.createObjectURL(file));
                                            setData('settings', {
                                                ...data.settings,
                                                dashboard_image: file,
                                            });
                                        }
                                    }}
                                    className="block w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />}
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Dashboard preview"
                                        className="mt-4 h-40 w-full rounded-lg border border-gray-600 object-contain bg-gray-900 p-2"
                                    />
                                )}
                                {canEditSettings && (
                                    <Button type="submit" disabled={processing} className="mt-4">
                                        {processing ? 'Uploading...' : 'Upload Image'}
                                    </Button>
                                )}
                            </form>
                        </div>

                    </div>}
                </div>
            </div>
        </>
    );
}
