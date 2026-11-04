import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import {
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    ChevronRight,
    History,
    Plus,
    Search,
    SquarePen,
    X,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import {
    CARD,
    PAGE_SIZES,
    PAGER_BTN,
    PatientFormDialog,
    Overlay,
    Skeleton,
    TD,
    TH,
    TOOLBAR_INPUT,
    ageOf,
    fmt,
    pageList,
    type PatientRecord,
} from '@/components/patients-shared';
import '../../css/dashboard.css';

interface DispenseRecord {
    id: number;
    dispensedAt: string;
    medicine: string;
    batchNo: string;
    quantity: string;
    dispensedBy: string;
}

interface PatientsData {
    patients: PatientRecord[];
}

type SortKey =
    | 'lastName'
    | 'firstName'
    | 'middleName'
    | 'birthdate'
    | 'age'
    | 'barangay';
type SortDir = 'asc' | 'desc';

type ModalState =
    | { type: 'form'; patient: PatientRecord | null }
    | { type: 'history'; patient: PatientRecord }
    | null;

const EMPTY_DATA: PatientsData = { patients: [] };

// TODO: replace with a real API request, e.g. axios.get('/api/patients').
// With thousands of records, switch to server-side search, sort and pagination.
async function fetchPatientsData(): Promise<PatientsData> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return EMPTY_DATA;
}

// TODO: replace with a real API request, e.g. axios.get(`/api/patients/${id}/history`).
// `dispensedAt` is an ISO date-time such as '2026-09-09T10:15:00'; `quantity` is text such as '21 caps'.
async function fetchPatientHistory(_patientId: number): Promise<DispenseRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [];
}

function usePatientsData() {
    const [data, setData] = useState<PatientsData | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchPatientsData().then((result) => {
            if (!cancelled) setData(result);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return { data, loading: data === null };
}

const COLUMNS: { key: SortKey; label: string }[] = [
    { key: 'lastName', label: 'Last name' },
    { key: 'firstName', label: 'First name' },
    { key: 'middleName', label: 'Middle name' },
    { key: 'birthdate', label: 'Birthdate' },
    { key: 'age', label: 'Age' },
    { key: 'barangay', label: 'Barangay' },
];

const fmtDay = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });

const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });

function HistoryDialog({
    patient,
    onClose,
}: {
    patient: PatientRecord;
    onClose: () => void;
}) {
    const [records, setRecords] = useState<DispenseRecord[] | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchPatientHistory(patient.id).then((result) => {
            if (!cancelled) setRecords(result);
        });
        return () => {
            cancelled = true;
        };
    }, [patient.id]);

    const meta = [
        ['Patient', `${patient.lastName}, ${patient.firstName}`],
        ['ID', patient.patientNo ?? '—'],
        ['Age', String(ageOf(patient.birthdate))],
        ['Brgy', patient.barangay],
    ] as const;

    const TH_H =
        'sticky top-0 h-12 whitespace-nowrap border-b border-slate-200 bg-white pr-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400';
    const TD_H =
        'h-[55px] whitespace-nowrap border-b border-slate-100 pr-4 text-[13px]';

    return (
        <Overlay
            label="Patient dispensing history"
            onClose={onClose}
            className={`${CARD} flex max-h-[90vh] w-full max-w-195 flex-col overflow-hidden`}
        >
            <div className="px-6 pt-6 pb-4">
                <div className="flex items-start justify-between gap-4">
                    <h2 className="text-[15px] font-extrabold tracking-wider text-emerald-950 uppercase">
                        Patient Dispensing History
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="-mt-1 -mr-1 cursor-pointer rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                <p className="mt-2 text-[13px] text-slate-500">
                    {meta.map(([label, value], i) => (
                        <span key={label}>
                            {i > 0 && ' · '}
                            {label}:{' '}
                            <span className="font-medium text-slate-800 uppercase">
                                {value}
                            </span>
                        </span>
                    ))}
                </p>
            </div>

            <div className="min-h-0 flex-1 overflow-auto border-t border-slate-200 px-6">
                <table className="w-full min-w-155 border-collapse">
                    <thead>
                        <tr>
                            <th className={TH_H}>Date &amp; time</th>
                            <th className={TH_H}>Medicine dispensed</th>
                            <th className={TH_H}>Batch no.</th>
                            <th className={TH_H}>Qty dispensed</th>
                            <th className={TH_H}>Dispensed by</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records === null ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i} aria-busy="true">
                                    <td className={TD_H}>
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="mt-1.5 h-3 w-12" />
                                    </td>
                                    {Array.from({ length: 4 }).map((__, j) => (
                                        <td key={j} className={TD_H}>
                                            <Skeleton className="h-4 w-28" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : records.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="h-48 text-center text-sm font-semibold text-slate-500"
                                >
                                    No dispensing history recorded for this
                                    patient
                                </td>
                            </tr>
                        ) : (
                            records.map((r) => (
                                <tr key={r.id}>
                                    <td className={TD_H}>
                                        <div className="font-medium text-slate-800">
                                            {fmtDay(r.dispensedAt)}
                                        </div>
                                        <div className="text-[11px] text-slate-400">
                                            {fmtTime(r.dispensedAt)}
                                        </div>
                                    </td>
                                    <td className={`${TD_H} text-slate-800`}>
                                        {r.medicine}
                                    </td>
                                    <td className={`${TD_H} text-slate-400`}>
                                        {r.batchNo}
                                    </td>
                                    <td
                                        className={`${TD_H} font-bold text-emerald-900`}
                                    >
                                        {r.quantity}
                                    </td>
                                    <td className={`${TD_H} text-slate-800`}>
                                        {r.dispensedBy}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-slate-200 px-6 py-4">
                <span className="text-[13px] text-slate-400">
                    {records === null ? (
                        'Loading transaction records…'
                    ) : (
                        <>
                            Showing{' '}
                            <b className="font-bold text-slate-600">
                                {records.length}
                            </b>{' '}
                            transaction{' '}
                            {records.length === 1 ? 'record' : 'records'}
                        </>
                    )}
                </span>
                <button
                    type="button"
                    onClick={onClose}
                    className="h-9 cursor-pointer rounded-md border border-emerald-900 bg-white px-6 text-xs font-bold tracking-widest text-emerald-900 uppercase transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
                >
                    Close
                </button>
            </footer>
        </Overlay>
    );
}

export default function PatientsHistory() {
    const { data, loading } = usePatientsData();
    const [added, setAdded] = useState<PatientRecord[]>([]);
    const [edits, setEdits] = useState<Record<number, PatientRecord>>({});
    const [search, setSearch] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
        key: 'lastName',
        dir: 'asc',
    });
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState<ModalState>(null);
    const nextId = useRef(-1);

    const all = [...added, ...(data ?? EMPTY_DATA).patients].map(
        (p) => edits[p.id] ?? p,
    );
    const hasPatients = all.length > 0;
    const controlsOff = loading || !hasPatients;

    const q = search.trim().toLowerCase();
    const filtered = all
        .filter((p) => {
            const text = [
                p.lastName,
                p.firstName,
                p.middleName ?? '',
                p.contactNumber ?? '',
                p.barangay,
            ]
                .join(' ')
                .toLowerCase();
            return (
                (!q || text.includes(q)) &&
                (!from || p.recordDate >= from) &&
                (!to || p.recordDate <= to)
            );
        })
        .sort((a, b) => {
            const factor = sort.dir === 'asc' ? 1 : -1;
            let result: number;
            switch (sort.key) {
                case 'birthdate':
                    result = a.birthdate.localeCompare(b.birthdate);
                    break;
                case 'age':
                    result = b.birthdate.localeCompare(a.birthdate);
                    break;
                case 'middleName':
                    result = (a.middleName ?? '').localeCompare(
                        b.middleName ?? '',
                    );
                    break;
                default:
                    result = a[sort.key].localeCompare(b[sort.key]);
            }
            return (
                result * factor ||
                a.lastName.localeCompare(b.lastName) ||
                a.firstName.localeCompare(b.firstName)
            );
        });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const current = Math.min(page, totalPages);
    const start = (current - 1) * pageSize;
    const rows = filtered.slice(start, start + pageSize);
    const filtersActive = q !== '' || from !== '' || to !== '';

    const toggleSort = (key: SortKey) => {
        setSort((s) =>
            s.key === key
                ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
                : { key, dir: 'asc' },
        );
        setPage(1);
    };

    const sortArrow = (key: SortKey) =>
        sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '';

    const clearFilters = () => {
        setSearch('');
        setFrom('');
        setTo('');
        setPage(1);
    };

    const savePatient = (record: PatientRecord) => {
        if (record.id === 0) {
            setAdded((prev) => [{ ...record, id: nextId.current-- }, ...prev]);
            clearFilters();
            // TODO: POST the new record to the backend, e.g. router.post('/patients', record)
        } else {
            setEdits((prev) => ({ ...prev, [record.id]: record }));
            // TODO: PATCH the record on the backend, e.g. router.patch(`/patients/${record.id}`, record)
        }
        setModal(null);
    };

    const closeModal = () => setModal(null);

    return (
        <>
            <Head title="Patients History" />
            <main className="dashboard-canvas flex min-h-full flex-col gap-4 text-slate-900">
                <section
                    className={`${CARD} flex min-h-160 flex-1 flex-col overflow-hidden`}
                >
                    <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-4">
                        <label className="relative min-w-60 flex-1 lg:max-w-125">
                            <span className="sr-only">Search patients</span>
                            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={search}
                                disabled={controlsOff}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search Patients by Name, Contact, or Barangay..."
                                className="h-9 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-10 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            />
                        </label>

                        <div className="ml-auto flex flex-wrap items-center gap-3">
                            <label className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                                From:
                                <input
                                    type="date"
                                    value={from}
                                    max={to || undefined}
                                    disabled={controlsOff}
                                    onChange={(e) => {
                                        setFrom(e.target.value);
                                        setPage(1);
                                    }}
                                    className={TOOLBAR_INPUT}
                                />
                            </label>
                            <label className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                                To:
                                <input
                                    type="date"
                                    value={to}
                                    min={from || undefined}
                                    disabled={controlsOff}
                                    onChange={(e) => {
                                        setTo(e.target.value);
                                        setPage(1);
                                    }}
                                    className={TOOLBAR_INPUT}
                                />
                            </label>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    setModal({ type: 'form', patient: null })
                                }
                                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-[#043d2b] px-5 text-xs font-bold tracking-wide text-white uppercase transition hover:bg-[#012b1d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#043d2b] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Plus className="size-4" />
                                New Patient Record
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full min-w-250 border-collapse">
                            <thead>
                                <tr>
                                    {COLUMNS.slice(0, 3).map((col) => (
                                        <th key={col.key} className={TH}>
                                            <button
                                                type="button"
                                                disabled={controlsOff}
                                                onClick={() => toggleSort(col.key)}
                                                className="cursor-pointer font-[inherit] tracking-[inherit] uppercase hover:text-slate-900 disabled:cursor-not-allowed"
                                            >
                                                {col.label}
                                                {sortArrow(col.key)}
                                            </button>
                                        </th>
                                    ))}
                                    <th className={TH}>Ext</th>
                                    {COLUMNS.slice(3).map((col) => (
                                        <th key={col.key} className={TH}>
                                            <button
                                                type="button"
                                                disabled={controlsOff}
                                                onClick={() => toggleSort(col.key)}
                                                className="cursor-pointer font-[inherit] tracking-[inherit] uppercase hover:text-slate-900 disabled:cursor-not-allowed"
                                            >
                                                {col.label}
                                                {sortArrow(col.key)}
                                            </button>
                                        </th>
                                    ))}
                                    <th className={TH}>Contact number</th>
                                    <th className={`${TH} text-center`}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 10 }).map((_, i) => (
                                        <tr key={i} aria-busy="true">
                                            {Array.from({ length: 9 }).map(
                                                (__, j) => (
                                                    <td key={j} className={TD}>
                                                        <Skeleton
                                                            className={`h-4 ${j === 8 ? 'mx-auto w-36' : j === 4 ? 'w-6' : 'w-24'}`}
                                                        />
                                                    </td>
                                                ),
                                            )}
                                        </tr>
                                    ))
                                ) : rows.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="h-72 text-center"
                                        >
                                            {hasPatients ? (
                                                <>
                                                    <div className="text-sm font-semibold text-slate-500">
                                                        No patients match your
                                                        search or filters
                                                    </div>
                                                    {filtersActive && (
                                                        <button
                                                            type="button"
                                                            onClick={clearFilters}
                                                            className="mt-1 cursor-pointer text-[11px] font-semibold text-emerald-700 hover:text-emerald-900"
                                                        >
                                                            Clear filters
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="text-sm font-semibold text-slate-500">
                                                        No patient records yet
                                                    </div>
                                                    <div className="mt-1 text-[11px] text-slate-400">
                                                        Use “New Patient Record”
                                                        to add the first one.
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="transition hover:bg-[#f6fbf7]"
                                        >
                                            <td
                                                className={`${TD} font-bold text-emerald-900`}
                                            >
                                                {p.lastName}
                                            </td>
                                            <td className={TD}>
                                                {p.firstName}
                                            </td>
                                            <td
                                                className={`${TD} text-slate-500`}
                                            >
                                                {p.middleName ?? 'NA'}
                                            </td>
                                            <td
                                                className={`${TD} text-slate-500`}
                                            >
                                                {p.ext ?? 'NA'}
                                            </td>
                                            <td className={TD}>
                                                {p.birthdate}
                                            </td>
                                            <td
                                                className={`${TD} font-bold`}
                                            >
                                                {ageOf(p.birthdate)}
                                            </td>
                                            <td className={TD}>
                                                {p.barangay}
                                            </td>
                                            <td className={TD}>
                                                {p.contactNumber ?? 'N/A'}
                                            </td>
                                            <td className={`${TD} text-center`}>
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setModal({
                                                                type: 'history',
                                                                patient: p,
                                                            })
                                                        }
                                                        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-emerald-700/40 bg-emerald-50/50 px-3 text-xs font-semibold text-emerald-800 normal-case transition hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                                                    >
                                                        <History className="size-3.5" />
                                                        History
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setModal({
                                                                type: 'form',
                                                                patient: p,
                                                            })
                                                        }
                                                        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 normal-case transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                                                    >
                                                        <SquarePen className="size-3.5" />
                                                        Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-[#f9fbfa] px-5 py-3 text-[13px] text-slate-500">
                        <label className="flex items-center gap-2">
                            Records per page:
                            <select
                                value={pageSize}
                                disabled={controlsOff}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="h-8 cursor-pointer rounded-md border border-slate-200 bg-white px-2 font-semibold text-slate-800 focus:border-emerald-800 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {PAGE_SIZES.map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="flex flex-wrap items-center gap-1">
                            <span className="mr-3">
                                {loading || total === 0
                                    ? '—'
                                    : `${fmt(start + 1)}–${fmt(Math.min(start + pageSize, total))} of ${fmt(total)}`}
                            </span>
                            <button
                                type="button"
                                aria-label="First page"
                                disabled={controlsOff || current === 1}
                                onClick={() => setPage(1)}
                                className={PAGER_BTN}
                            >
                                <ChevronFirst className="size-4" />
                            </button>
                            <button
                                type="button"
                                aria-label="Previous page"
                                disabled={controlsOff || current === 1}
                                onClick={() => setPage(current - 1)}
                                className={PAGER_BTN}
                            >
                                <ChevronLeft className="size-4" />
                            </button>
                            {pageList(current, totalPages).map((n, i) =>
                                n === 'gap' ? (
                                    <span
                                        key={`gap-${i}`}
                                        className="px-1 text-slate-400"
                                    >
                                        …
                                    </span>
                                ) : (
                                    <button
                                        key={n}
                                        type="button"
                                        disabled={controlsOff}
                                        aria-current={
                                            n === current ? 'page' : undefined
                                        }
                                        onClick={() => setPage(n)}
                                        className={`${PAGER_BTN} ${n === current && !controlsOff ? 'bg-[#043d2b] font-bold text-white hover:bg-[#043d2b]' : ''}`}
                                    >
                                        {n}
                                    </button>
                                ),
                            )}
                            <button
                                type="button"
                                aria-label="Next page"
                                disabled={controlsOff || current === totalPages}
                                onClick={() => setPage(current + 1)}
                                className={PAGER_BTN}
                            >
                                <ChevronRight className="size-4" />
                            </button>
                            <button
                                type="button"
                                aria-label="Last page"
                                disabled={controlsOff || current === totalPages}
                                onClick={() => setPage(totalPages)}
                                className={PAGER_BTN}
                            >
                                <ChevronLast className="size-4" />
                            </button>
                        </div>
                    </footer>
                </section>
            </main>

            {modal?.type === 'form' && (
                <PatientFormDialog
                    patient={modal.patient}
                    existing={all}
                    onClose={closeModal}
                    onSave={savePatient}
                />
            )}
            {modal?.type === 'history' && (
                <HistoryDialog patient={modal.patient} onClose={closeModal} />
            )}
        </>
    );
}

PatientsHistory.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;