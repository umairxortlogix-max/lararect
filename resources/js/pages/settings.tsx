
import { Head, useForm } from '@inertiajs/react';

interface Setting {
    key: string;
    value: string;
}

interface Props {
    settings: Setting[];
}

export default function SettingsPage({ settings = [] }: Props) {
    const getSettingValue = (key: string) => {
        return settings.find((setting) => setting.key === key)?.value || '';
    };

    const { data, setData, post, processing, errors } = useForm({
        settings: {
            client_id: getSettingValue('client_id'),
            client_secret: getSettingValue('client_secret'),
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/settings/store', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Settings" />

            <div className="flex h-full flex-1 flex-col overflow-x-auto p-4">
                <div className="mx-auto w-full max-w-3xl">

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
                </div>
            </div>
        </>
    );
}
