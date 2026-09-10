// cspell:ignore inertiajs
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

interface TagRecord {
    id?: number | string;
    tag?: string;
    name?: string;
}

interface CustomFieldRecord {
    id?: number | string;
    field_id?: string | number | null;
    fieldId?: string | number | null;
    value?: string | number | boolean | null;
}

interface AttributionRecord {
    id?: number | string;
    campaign?: string | null;
    utm_source?: string | null;
    utmSource?: string | null;
    medium?: string | null;
    referrer?: string | null;
    url?: string | null;
}

interface ContactProps {
    id?: number | string;
    name?: string;
    contact?: string;
    location?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    source?: string;
    ghl_date_added?: string | null;
    tags?: TagRecord[];
    customFields?: CustomFieldRecord[];
    attributions?: AttributionRecord[];
}

const pageSize = 10;

function calculateScore(contact: ContactProps): number {
    const today = new Date();
    const createdAt = contact.ghl_date_added ? new Date(contact.ghl_date_added) : null;
    const daysSinceCreated = createdAt ? Math.max(0, Math.floor((today.getTime() - createdAt.getTime()) / 86400000)) : 15;

    let score = 35;

    if (contact.email) score += 18;
    if (contact.phone) score += 14;
    if (contact.source) score += 10;
    if (contact.country || contact.city || contact.address) score += 10;
    if (daysSinceCreated <= 7) score += 14;
    else if (daysSinceCreated <= 30) score += 6;
    else score -= 14;

    if (contact.source && /google|facebook|instagram|ads|paid/i.test(contact.source)) score += 8;
    score = Math.max(20, Math.min(100, score));

    return score;
}

function getPriority(contact: ContactProps) {
    const score = calculateScore(contact);

    if (score >= 80) return { label: 'Hot Lead', tone: 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]', score };
    if (score >= 65) return { label: 'New Today', tone: 'bg-[#ecfeff] text-[#0f766e] border-[#a5f3fc]', score };
    if (score >= 50) return { label: 'Follow-up', tone: 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]', score };
    if (score >= 35) return { label: 'Waiting', tone: 'bg-[#fefce8] text-[#a16207] border-[#fde68a]', score };
    return { label: 'At Risk', tone: 'bg-[#f3f4f6] text-[#374151] border-[#d1d5db]', score };
}

export default function Contact({ contacts = [] }: { contacts?: ContactProps[] }) {
    const [currentPage, setCurrentPage] = useState(1);

    const computed = useMemo(() => {
        const enriched = contacts.map((contact) => ({
            ...contact,
            score: calculateScore(contact),
            priority: getPriority(contact),
            displayName: contact.name ?? (([contact.first_name, contact.last_name].filter(Boolean).join(' ') || '-')),
            tagSummary: (Array.isArray(contact.tags) ? contact.tags : []).map((tag) => tag.tag ?? tag.name ?? '').filter(Boolean),
            customFieldSummary: (Array.isArray(contact.customFields) ? contact.customFields : []).map((field) => {
                const label = field.field_id ?? field.fieldId ?? 'Custom field';
                const value = field.value ?? 'Set';
                return `${String(label)}: ${String(value)}`;
            }),
            attributionSummary: (Array.isArray(contact.attributions) ? contact.attributions : []).map((attribution) => {
                return attribution.utm_source ?? attribution.utmSource ?? attribution.campaign ?? attribution.medium ?? attribution.referrer ?? 'Direct';
            }),
        }));

        const hotLeads = enriched.filter((contact) => contact.score >= 80).length;
        const newToday = enriched.filter((contact) => {
            const date = contact.ghl_date_added ? new Date(contact.ghl_date_added) : null;
            if (!date) return false;
            const now = new Date();
            return date.toDateString() === now.toDateString();
        }).length;

        const followUpDue = enriched.filter((contact) => contact.score >= 50 && contact.score < 80).length;
        const waiting = enriched.filter((contact) => contact.score >= 35 && contact.score < 50).length;
        const atRisk = enriched.filter((contact) => contact.score < 35).length;
        const highValue = enriched.filter((contact) => contact.score >= 75 && (contact.source || '').toLowerCase().includes('google')).length;

        const tagCounts = new Map<string, number>();
        const customFieldCounts = new Map<string, number>();
        const attributionCounts = new Map<string, number>();

        enriched.forEach((contact) => {
            (contact.tagSummary ?? []).forEach((tag) => {
                const normalized = tag.trim();
                if (!normalized) return;
                tagCounts.set(normalized, (tagCounts.get(normalized) ?? 0) + 1);
            });

            (contact.customFieldSummary ?? []).forEach((field) => {
                const normalized = field.trim();
                if (!normalized) return;
                customFieldCounts.set(normalized, (customFieldCounts.get(normalized) ?? 0) + 1);
            });

            (contact.attributionSummary ?? []).forEach((source) => {
                const normalized = source.trim();
                if (!normalized) return;
                attributionCounts.set(normalized, (attributionCounts.get(normalized) ?? 0) + 1);
            });
        });

        return {
            enriched,
            metrics: {
                hotLeads,
                newToday,
                followUpDue,
                waiting,
                atRisk,
                highValue,
            },
            tagSummary: [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6),
            customFieldSummary: [...customFieldCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6),
            attributionSummary: [...attributionCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6),
        };
    }, [contacts]);

    const totalPages = Math.max(1, Math.ceil(computed.enriched.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * pageSize;
    const paginatedContacts = computed.enriched.slice(startIndex, startIndex + pageSize);

    useEffect(() => {
        setCurrentPage((prev) => Math.min(prev, totalPages));
    }, [contacts.length, totalPages]);

    return (
        <>
            <Head title="Contact Intelligence" />

            <div className="min-h-full flex-1 bg-[#f5f7f8] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-[1500px] space-y-6">
                    <section className="rounded-2xl border border-[#bbf7d0] bg-white p-6 shadow-[0_8px_22px_rgba(37,211,102,0.08)]">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#128c7e]">Contact Intelligence</p>
                                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1f2937]">Action-ready contact overview</h1>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                            <MetricTile label="Hot Leads" value={computed.metrics.hotLeads} emoji="🔥" tone="bg-[#fef2f2] text-[#b91c1c]" />
                            <MetricTile label="New Today" value={computed.metrics.newToday} emoji="🆕" tone="bg-[#ecfeff] text-[#0f766e]" />
                            <MetricTile label="Follow-up" value={computed.metrics.followUpDue} emoji="📞" tone="bg-[#eff6ff] text-[#1d4ed8]" />
                            <MetricTile label="Waiting" value={computed.metrics.waiting} emoji="💬" tone="bg-[#fefce8] text-[#a16207]" />
                            <MetricTile label="At Risk" value={computed.metrics.atRisk} emoji="⚠️" tone="bg-[#f3f4f6] text-[#374151]" />
                            <MetricTile label="High Value" value={computed.metrics.highValue} emoji="⭐" tone="bg-[#fdf2f8] text-[#9d174d]" />
                        </div>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-3">
                        <SummaryBlock
                            title="Tags wise"
                            data={computed.tagSummary}
                            accent="bg-[#ecfdf5] text-[#166534] border-[#bbf7d0]"
                        />
                        <SummaryBlock
                            title="Custom fields"
                            data={computed.customFieldSummary}
                            accent="bg-[#f0fdf4] text-[#128c7e] border-[#bbf7d0]"
                        />
                        <SummaryBlock
                            title="Attribution wise"
                            data={computed.attributionSummary}
                            accent="bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]"
                        />
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
                        <div className="rounded-2xl border border-[#bbf7d0] bg-white p-6 shadow-[0_8px_22px_rgba(37,211,102,0.08)]">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-[#1f2937]">What needs your attention?</h2>
                                <span className="rounded-full bg-[#f0fdf4] px-2.5 py-1 text-xs font-medium text-[#128c7e]">Live</span>
                            </div>

                            <div className="mb-6 rounded-xl border border-[#bbf7d0] bg-[#f9fefb] p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#128c7e]">Contact Score Graph</h3>
                                    <span className="text-xs text-[#475569]">Avg {Math.round(computed.enriched.reduce((sum, contact) => sum + contact.score, 0) / Math.max(1, computed.enriched.length))}/100</span>
                                </div>

                                <div className="flex h-40 items-end gap-3">
                                    {[75, 60, 85, 52, 90, 70, 88, 64].map((value, index) => (
                                        <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                                            <div className="flex w-full items-end justify-center rounded-t-xl bg-gradient-to-t from-[#128c7e] via-[#25d366] to-[#bbf7d0]" style={{ height: `${value}%` }} />
                                            <span className="text-[10px] text-[#6b7280]">{index + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {computed.enriched.slice(0, 5).map((contact) => (
                                    <div key={contact.id ?? contact.email ?? contact.phone ?? `${contact.displayName}-${contact.source}`} className="rounded-xl border border-[#bbf7d0] bg-[#f9fefb] p-4">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-[#1f2937]">{contact.displayName}</h3>
                                                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${contact.priority.tone}`}>
                                                        {contact.priority.label}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-[#475569]">{contact.source ?? 'Direct'} • {contact.country ?? 'Unknown country'}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-[#128c7e]">{contact.score}/100</div>
                                                <div className="text-xs text-[#6b7280]">Engagement score</div>
                                            </div>
                                        </div>

                                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dcfce7]">
                                            <div className="h-full rounded-full bg-gradient-to-r from-[#25d366] via-[#128c7e] to-[#075e54]" style={{ width: `${contact.score}%` }} />
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <ActionChip label="Open" />
                                            <ActionChip label="Message" />
                                            <ActionChip label="Call" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#bbf7d0] bg-white p-6 shadow-[0_8px_22px_rgba(37,211,102,0.08)]">
                            <h2 className="text-lg font-semibold text-[#1f2937]">Today’s actions</h2>
                            <div className="mt-5 space-y-4">
                                {computed.enriched.slice(0, 4).map((contact) => (
                                    <div key={`action-${contact.id ?? contact.email}`} className="rounded-xl border border-[#bbf7d0] bg-[#f9fefb] p-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-medium text-[#1f2937]">{contact.displayName}</p>
                                                <p className="mt-1 text-xs text-[#475569]">
                                                    {contact.priority.label === 'Hot Lead' ? 'Replied recently' : 'Needs follow-up'}
                                                </p>
                                            </div>
                                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${contact.priority.tone}`}>
                                                {contact.score}
                                            </span>
                                        </div>
                                        <button type="button" className="mt-3 text-xs font-medium text-[#128c7e]">Respond now</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-[#bbf7d0] bg-white shadow-[0_8px_22px_rgba(37,211,102,0.08)]">
                        <div className="flex items-center justify-between border-b border-[#bbf7d0] bg-[#f0fdf4] px-5 py-4">
                            <h2 className="text-lg font-semibold text-[#1f2937]">Contacts</h2>
                            <span className="text-sm text-[#128c7e]">{computed.enriched.length} total</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[#bbf7d0] text-left text-sm">
                                <thead className="bg-[#f0fdf4]">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-[#1f2937]">Name</th>
                                        <th className="px-4 py-3 font-semibold text-[#1f2937]">Email</th>
                                        <th className="px-4 py-3 font-semibold text-[#1f2937]">Phone</th>
                                        <th className="px-4 py-3 font-semibold text-[#1f2937]">Source</th>
                                        <th className="px-4 py-3 font-semibold text-[#1f2937]">Nation</th>
                                        <th className="px-4 py-3 font-semibold text-[#1f2937]">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#bbf7d0] bg-white">
                                    {paginatedContacts.map((contact, index) => (
                                        <tr key={contact.id ?? contact.email ?? index} className="hover:bg-[#f0fdf4]">
                                            <td className="px-4 py-3 font-medium text-[#1f2937]">
                                                <div className="flex items-center gap-2">
                                                    <span>{contact.displayName}</span>
                                                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${contact.priority.tone}`}>
                                                        {contact.priority.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-[#475569]">{contact.email ?? '-'}</td>
                                            <td className="px-4 py-3 text-[#475569]">{contact.phone ?? '-'}</td>
                                            <td className="px-4 py-3 text-[#475569]">{contact.source ?? '-'}</td>
                                            <td className="px-4 py-3 text-[#475569]">{contact.country ?? '-'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-[#128c7e]">{contact.score}</span>
                                                    <div className="h-2 w-20 overflow-hidden rounded-full bg-[#dcfce7]">
                                                        <div className="h-full rounded-full bg-gradient-to-r from-[#25d366] via-[#128c7e] to-[#075e54]" style={{ width: `${contact.score}%` }} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm text-[#128c7e]">
                            <span>Page {safeCurrentPage} of {totalPages}</span>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safeCurrentPage === 1} className="rounded-md border border-[#bbf7d0] bg-white px-3 py-1.5 font-medium text-[#1f2937] disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
                                <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={safeCurrentPage === totalPages} className="rounded-md border border-[#bbf7d0] bg-white px-3 py-1.5 font-medium text-[#1f2937] disabled:cursor-not-allowed disabled:opacity-50">Next</button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

function MetricTile({ label, value, emoji, tone }: { label: string; value: number; emoji: string; tone: string }) {
    return (
        <div className={`rounded-xl border border-[#bbf7d0] p-4 ${tone}`}>
            <div className="flex items-center justify-between gap-3">
                <span className="text-2xl">{emoji}</span>
                <span className="text-2xl font-bold">{value}</span>
            </div>
            <p className="mt-3 text-sm font-medium">{label}</p>
        </div>
    );
}

function SummaryBlock({ title, data, accent }: { title: string; data: Array<[string, number]>; accent: string }) {
    return (
        <div className={`rounded-2xl border p-5 ${accent}`}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em]">{title}</h3>
            <div className="space-y-3">
                {data.length === 0 ? (
                    <p className="text-sm opacity-70">No data found</p>
                ) : (
                    data.map(([label, count]) => (
                        <div key={`${title}-${label}`} className="flex items-center justify-between gap-3 rounded-lg border border-white/60 bg-white/40 px-3 py-2">
                            <span className="truncate text-sm font-medium">{label}</span>
                            <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-bold">{count}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function ActionChip({ label }: { label: string }) {
    return (
        <span className="rounded-full border border-[#bbf7d0] bg-white px-2.5 py-1 text-[10px] font-medium text-[#128c7e]">{label}</span>
    );
}