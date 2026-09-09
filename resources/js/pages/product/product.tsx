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

            <div className="min-h-svh bg-[#f5f7f8] p-6">
                <h1 className="mb-6 text-2xl font-bold text-[#1f2937]">
                    API Products
                </h1>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="glass-panel rounded-2xl p-4 transition-shadow hover:shadow-[0_14px_30px_rgba(37,211,102,0.12)]"
                        >
                            <img
                                src={product.image}
                                alt={product.title}
                                className="mb-4 h-40 w-full object-contain"
                            />

                            <h2 className="text-lg font-semibold">
                                {product.title}
                            </h2>

                            <p className="mt-2 text-sm text-[#6b7280]">
                                {product.description}
                            </p>

                            <p className="mt-3 font-bold">
                                ${product.price}
                            </p>

                            <p className="mt-1 text-sm text-[#6b7280]">
                                {product.category}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}