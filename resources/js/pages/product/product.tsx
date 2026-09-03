import { Head } from '@inertiajs/react';


interface Product{
    id:number;
    title:string;
    description:string;
    price:number;
    category:string;
    image:string;
}
interface props{
    products:Product[];
}
export default function ApiTest({ products = [] }:props) {
    return (
        <>
            <Head title="API Test" />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">
                    API Products
                </h1>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="rounded-lg border p-4 shadow-sm"
                        >
                            <img
                                src={product.image}
                                alt={product.title}
                                className="mb-4 h-40 w-full object-contain"
                            />

                            <h2 className="text-lg font-semibold">
                                {product.title}
                            </h2>

                            <p className="mt-2 text-sm text-gray-600">
                                {product.description}
                            </p>

                            <p className="mt-3 font-bold">
                                ${product.price}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                {product.category}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}