import { Head } from '@inertiajs/react';

export default function CreateProduct() {
    return (
        <>
            <Head title="Create Product" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Create Product</h1>

                <div>
                    <form action="/products" method="POST">
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>

                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                         <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                email
                            </label>

                            <input
                                type="text"
                                id="email"
                                name="email"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-white"
                        >
                            Create Product
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}