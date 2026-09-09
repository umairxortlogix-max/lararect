import { Head } from '@inertiajs/react';
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    DollarSign,
    MoreHorizontal,
    Package,
    Users,
} from 'lucide-react';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-full flex-1 overflow-visible bg-[#f5f7f8] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-[1600px] space-y-7">
                    <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#128c7e]">
                                Overview
                            </p>
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1f2937] sm:text-3xl">
                                Good morning, welcome back.
                            </h1>
                            <p className="mt-2 text-sm text-[#6b7280]">
                                Here is what is happening across your workspace today.
                            </p>
                        </div>
                        <button className="inline-flex h-10 items-center justify-center rounded-xl bg-[#25d366] px-4 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(37,211,102,0.2)] transition hover:bg-[#128c7e]">
                            Export report
                        </button>
                    </section>

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard icon={DollarSign} label="Total revenue" value="$48,290" change="12.8%" detail="vs. last month" positive />
                        <StatCard icon={Users} label="Active users" value="12,840" change="8.4%" detail="vs. last month" positive />
                        <StatCard icon={Package} label="Total products" value="1,284" change="3.2%" detail="vs. last month" positive />
                        <StatCard icon={Activity} label="Conversion rate" value="6.48%" change="1.6%" detail="vs. last month" positive={false} />
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
                        <div className="glass-panel overflow-visible rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25d366]/40 hover:shadow-[0_18px_40px_rgba(37,211,102,0.12)] sm:p-6">
                            <div className="mb-6 flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#1f2937]">Revenue overview</p>
                                    <p className="mt-1 text-xs text-[#6b7280]">Monthly performance for 2026</p>
                                </div>
                                <button className="flex size-9 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f0fdf4] hover:text-[#075e54]" aria-label="More revenue options">
                                    <MoreHorizontal className="size-4" />
                                </button>
                            </div>
                            <div className="mb-5 flex items-baseline gap-3">
                                <span className="text-2xl font-semibold text-[#1f2937]">$48,290</span>
                                <span className="text-xs font-medium text-[#25d366]">+12.8%</span>
                            </div>
                            <div className="relative h-56 w-full">
                                <div className="absolute inset-0 flex flex-col justify-between text-[11px] text-[#6b7280]/65">
                                    <span>$60k</span><span>$45k</span><span>$30k</span><span>$15k</span><span>$0</span>
                                </div>
                                <svg viewBox="0 0 720 220" className="absolute inset-0 ml-9 size-[calc(100%-36px)] overflow-visible" preserveAspectRatio="none" role="img" aria-label="Revenue trend chart">
                                    <defs>
                                        <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#25d366" stopOpacity="0.24" />
                                            <stop offset="100%" stopColor="#25d366" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0 190 H720 M0 142 H720 M0 94 H720 M0 46 H720" stroke="#6b7280" strokeOpacity="0.12" strokeWidth="1" />
                                    <path d="M0 174 C50 166 62 148 112 157 S170 118 220 132 S276 102 324 113 S380 76 430 94 S482 62 532 76 S598 38 648 52 S690 30 720 38 V220 H0 Z" fill="url(#areaFill)" />
                                    <path d="M0 174 C50 166 62 148 112 157 S170 118 220 132 S276 102 324 113 S380 76 430 94 S482 62 532 76 S598 38 648 52 S690 30 720 38" fill="none" stroke="#25d366" strokeLinecap="round" strokeWidth="3" />
                                </svg>
                                <div className="absolute right-0 bottom-0 left-9 flex justify-between text-[11px] text-[#6b7280]/65">
                                    <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel overflow-visible rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25d366]/40 hover:shadow-[0_18px_40px_rgba(37,211,102,0.12)] sm:p-6">
                            <div className="mb-7 flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#1f2937]">Traffic sources</p>
                                    <p className="mt-1 text-xs text-[#6b7280]">Where users come from</p>
                                </div>
                                <Activity className="size-5 text-[#128c7e]" />
                            </div>
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="relative flex size-36 shrink-0 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#25d366 0 42%, #128c7e 42% 72%, #075e54 72% 88%, #dcf8c6 88% 100%)' }}>
                                    <div className="flex size-24 flex-col items-center justify-center rounded-full bg-white">
                                        <span className="text-2xl font-semibold text-[#1f2937]">82%</span>
                                        <span className="text-[10px] text-[#6b7280]">engaged</span>
                                    </div>
                                </div>
                                <div className="min-w-[170px] space-y-4 text-xs">
                                    <Legend color="bg-[#25d366]" label="Organic search" value="42%" />
                                    <Legend color="bg-[#128c7e]" label="Social media" value="30%" />
                                    <Legend color="bg-[#075e54]" label="Referral" value="16%" />
                                    <Legend color="bg-[#dcf8c6]" label="Other" value="12%" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="glass-panel overflow-visible rounded-2xl">
                        <div className="flex items-center justify-between border-b border-[#35cfff]/10 px-5 py-5 sm:px-6">
                            <div>
                                <p className="text-sm font-medium text-[#1f2937]">Recent activity</p>
                                <p className="mt-1 text-xs text-[#6b7280]">Latest updates across your workspace</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="hidden rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-2.5 py-1 text-[11px] text-[#128c7e] sm:inline-flex">3 updates</span>
                                <button className="text-xs font-medium text-[#128c7e] hover:text-[#075e54]">View all</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[620px] text-left text-sm">
                                <thead className="glass-table-header">
                                    <tr><th className="px-5 py-3 font-medium sm:px-6">Activity</th><th className="px-5 py-3 font-medium">User</th><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Status</th></tr>
                                </thead>
                                <tbody className="text-[#1f2937]">
                                    <ActivityRow icon={Package} title="New product added" detail="Enterprise plan" user="Olivia Martin" date="Today, 10:42 AM" status="Completed" />
                                    <ActivityRow icon={Users} title="New team member" detail="Design team" user="Noah Williams" date="Today, 09:18 AM" status="Completed" />
                                    <ActivityRow icon={DollarSign} title="Payment processed" detail="$2,490.00 invoice" user="Sophia Davis" date="Yesterday, 04:32 PM" status="Pending" />
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

function StatCard({ icon: Icon, label, value, change, detail, positive }: { icon: typeof DollarSign; label: string; value: string; change: string; detail: string; positive: boolean }) {
    return (
        <div className="glass-panel group relative overflow-hidden rounded-2xl border-t-[#25d366]/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#25d366]/40 hover:shadow-[0_20px_42px_rgba(37,211,102,0.14)]">
            <div className="pointer-events-none absolute -top-14 -right-8 size-28 rounded-full bg-[#25d366]/10 blur-2xl transition-opacity group-hover:opacity-100" />
            <div className="mb-5 flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] text-[#128c7e]"><Icon className="size-5" /></span>
                <span className="text-xs text-[#6b7280]">This month</span>
            </div>
            <p className="text-sm text-[#6b7280]">{label}</p>
            <div className="mt-2 flex items-end justify-between gap-2">
                <p className="text-2xl font-semibold tracking-tight text-[#1f2937]">{value}</p>
                <span className={`mb-1 inline-flex items-center text-xs font-medium ${positive ? 'text-[#25d366]' : 'text-[#ef4444]'}`}>
                    {positive ? <ArrowUpRight className="mr-0.5 size-3.5" /> : <ArrowDownRight className="mr-0.5 size-3.5" />}{change}
                </span>
            </div>
            <p className="mt-2 text-xs text-[#6b7280]">{detail}</p>
        </div>
    );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
    return <div className="flex items-center gap-2"><span className={`size-2 rounded-full ${color}`} /><span className="w-20 text-[#6b7280]">{label}</span><strong className="text-[#1f2937]">{value}</strong></div>;
}

function ActivityRow({ icon: Icon, title, detail, user, date, status }: { icon: typeof Package; title: string; detail: string; user: string; date: string; status: string }) {
    return <tr className="glass-table-row"><td className="px-5 py-4 sm:px-6"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] text-[#128c7e]"><Icon className="size-4" /></span><div><p className="font-medium text-[#1f2937]">{title}</p><p className="mt-0.5 text-xs text-[#6b7280]">{detail}</p></div></div></td><td className="px-5 py-4 text-[#6b7280]">{user}</td><td className="px-5 py-4 text-xs text-[#6b7280]">{date}</td><td className="px-5 py-4"><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${status === 'Completed' ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#128c7e]' : 'border-[#fde68a] bg-[#fffbeb] text-[#b45309]'}`}>{status}</span></td></tr>;
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
