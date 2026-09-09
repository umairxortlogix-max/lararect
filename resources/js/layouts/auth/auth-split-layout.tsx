import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid min-h-dvh flex-col items-center justify-center bg-[#f7f8f5] px-6 sm:px-0 lg:max-w-none lg:grid-cols-[1.05fr_0.95fr] lg:px-0 dark:bg-zinc-950">
            <div className="relative hidden h-full min-h-dvh flex-col overflow-hidden bg-[#173b3f] p-10 text-white lg:flex xl:p-14">
                <div className="absolute -top-32 -right-24 size-96 rounded-full border border-white/10" />
                <div className="absolute -right-8 bottom-16 size-64 rounded-full border border-[#d6e7b8]/20" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_top,black,transparent)]" />
                <Link
                    href="/"
                    className="relative z-20 flex items-center gap-3 text-lg font-semibold tracking-tight"
                >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-[#d6e7b8] text-[#173b3f] shadow-lg shadow-black/10">
                        <AppLogoIcon className="size-6 fill-current" />
                    </span>
                    {name}
                </Link>
                <div className="relative z-10 mt-auto max-w-xl pb-10">
                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#d6e7b8]">
                        A calmer way to work
                    </p>
                    <h2 className="max-w-lg text-4xl leading-[1.08] font-semibold tracking-tight xl:text-6xl">
                        Everything important, in one clear view.
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                        Pick up where you left off with a workspace built for focused teams and thoughtful progress.
                    </p>
                </div>
            </div>
            <div className="flex w-full items-center justify-center px-2 py-10 sm:px-8 lg:p-12">
                <div className="w-full max-w-[390px]">
                    <Link
                        href="/"
                        className="relative z-20 mb-12 flex items-center justify-center gap-3 text-sm font-semibold tracking-tight lg:hidden"
                    >
                        <span className="flex size-9 items-center justify-center rounded-lg bg-[#173b3f] text-white">
                            <AppLogoIcon className="size-5 fill-current" />
                        </span>
                        {name}
                    </Link>
                    <div className="mb-9 flex flex-col items-start gap-2 text-left">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b8f61]">
                            Welcome back
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight text-[#173b3f] dark:text-white">{title}</h1>
                        <p className="text-muted-foreground text-sm leading-6 text-balance">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
