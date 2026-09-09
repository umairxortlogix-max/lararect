import { MessageCircle } from 'lucide-react';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#f5f7f8] px-5 py-10 text-[#1f2937] sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(37,211,102,0.14),transparent_34%),linear-gradient(145deg,#f5f7f8_0%,#eefbf2_100%)]" />
            <div className="absolute top-1/2 left-1/2 size-[min(75vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#25d366]/10" />
            <section className="relative z-10 w-full max-w-[430px] rounded-3xl border border-white bg-white p-7 shadow-[0_24px_70px_rgba(31,41,55,0.12)] sm:p-10">
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-6 flex size-[74px] items-center justify-center rounded-full bg-[#dcf8c6] text-[#075e54] shadow-[0_0_28px_rgba(37,211,102,0.2)]">
                        <MessageCircle className="size-9 stroke-[1.7]" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-[#1f2937] sm:text-[27px]">
                        {title}
                    </h1>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#6b7280]">
                        {description}
                    </p>
                </div>
                {children}
            </section>
        </main>
    );
}
