import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    FileText,
    Plus,
    Search,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import {
    CARD,
    PAGE_SIZES,
    PatientFormDialog,
    Overlay,
    Skeleton,
    TOOLBAR_INPUT,
    ageOf,
    fmt,
    pageList,
    todayIso,
    type PatientRecord,
} from '@/components/patients-shared';
import '../../css/dashboard.css';

interface BatchOption {
    id: number;
    batchNo: string;
    expiry: string;
    stock: number;
}

interface MedicineOption {
    id: number;
    name: string;
    batches: BatchOption[];
}

interface ReleasingData {
    patients: PatientRecord[];
    medicines: MedicineOption[];
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
    | { type: 'form' }
    | { type: 'dispense'; patient: PatientRecord }
    | null;

const EMPTY_DATA: ReleasingData = { patients: [], medicines: [] };

// TODO: replace with a real API request, e.g. axios.get('/api/releasing').
// `medicines` should list every medicine with its batches (batch number, expiry date, units in stock).
// With thousands of patients, switch to server-side search, sort and pagination.
async function fetchReleasingData(): Promise<ReleasingData> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return EMPTY_DATA;
}

function useReleasingData() {
    const [data, setData] = useState<ReleasingData | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchReleasingData().then((result) => {
            if (!cancelled) setData(result);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return { data, loading: data === null };
}

const TH =
    'h-[34px] whitespace-nowrap border-y border-r border-slate-200 bg-slate-50/70 px-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 last:border-r-0';
const TD =
    'h-[41px] whitespace-nowrap border-b border-r border-slate-100 px-4 text-left text-[13px] uppercase last:border-r-0';
const PAGER =
    'grid size-8 cursor-pointer place-items-center rounded-md border border-slate-200 bg-white text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white';
const FIELD_LABEL =
    'text-[11px] font-bold tracking-widest text-slate-500 uppercase';
const DISPENSE_INPUT =
    'h-11 rounded-lg border border-slate-200 bg-white px-4 text-[15px] text-slate-800 focus:border-[#1b5e4a] focus:ring-2 focus:ring-[#1b5e4a]/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60';

const availableBatches = (
    medicine: MedicineOption | undefined,
    used: Record<number, number>,
) =>
    (medicine?.batches ?? [])
        .map((b) => ({ ...b, stock: b.stock - (used[b.id] ?? 0) }))
        .filter((b) => b.stock > 0 && b.expiry >= todayIso())
        .sort((a, b) => a.expiry.localeCompare(b.expiry));

interface DispenseResult {
    medicine: MedicineOption;
    batch: BatchOption;
    quantity: number;
}

function DispenseDialog({
    patient,
    medicines,
    used,
    onClose,
    onConfirm,
}: {
    patient: PatientRecord;
    medicines: MedicineOption[];
    used: Record<number, number>;
    onClose: () => void;
    onConfirm: (result: DispenseResult) => void;
}) {
    const [medicineId, setMedicineId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [errors, setErrors] = useState<{
        medicine?: string;
        quantity?: string;
    }>({});

    const medicine = medicines.find((m) => String(m.id) === medicineId);
    const batch = availableBatches(medicine, used)[0];

    const meta = [
        ['Patient', `${patient.lastName}, ${patient.firstName}`],
        ['ID', patient.patientNo ?? '—'],
        ['Brgy', patient.barangay],
        ['Age', String(ageOf(patient.birthdate))],
    ] as const;

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const next: typeof errors = {};
        const qty = Number(quantity);

        if (!medicine) next.medicine = 'Select a medicine.';
        else if (!batch)
            next.medicine = 'No batch with stock is available for this medicine.';

        if (!Number.isInteger(qty) || qty < 1)
            next.quantity = 'Enter a whole number of 1 or more.';
        else if (batch && qty > batch.stock)
            next.quantity = `Only ${fmt(batch.stock)} units are available in this batch.`;

        setErrors(next);
        if (Object.keys(next).length > 0 || !medicine || !batch) return;
        onConfirm({ medicine, batch, quantity: qty });
    };

    return (
        <Overlay
            label="Dispense medicine transaction"
            onClose={onClose}
            className={`${CARD} max-h-[92vh] w-full max-w-145 overflow-y-auto`}
        >
            <form onSubmit={submit} noValidate>
                <div className="px-6 pt-6 pb-5">
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="text-[17px] font-extrabold tracking-wider text-[#1b5e4a] uppercase">
                            Dispense Medicine Transaction
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
                    <p className="mt-3 text-[13px] text-slate-600">
                        {meta.map(([label, value], i) => (
                            <span key={label}>
                                {i > 0 && (
                                    <span className="mx-2 text-slate-300">
                                        ·
                                    </span>
                                )}
                                {label}:{' '}
                                <b className="font-bold text-slate-800 uppercase">
                                    {value}
                                </b>
                            </span>
                        ))}
                    </p>
                </div>

                <div className="space-y-5 border-t border-slate-200 px-6 py-5">
                    <div>
                        <label htmlFor="dispense-medicine" className={FIELD_LABEL}>
                            Select medicine
                        </label>
                        <select
                            id="dispense-medicine"
                            value={medicineId}
                            disabled={medicines.length === 0}
                            onChange={(e) => {
                                setMedicineId(e.target.value);
                                setErrors((x) => ({ ...x, medicine: undefined }));
                            }}
                            className={`${DISPENSE_INPUT} mt-2 w-full cursor-pointer`}
                        >
                            <option value="">
                                {medicines.length === 0
                                    ? 'No medicines available'
                                    : 'Select a medicine'}
                            </option>
                            {medicines.map((m) => (
                                <option
                                    key={m.id}
                                    value={m.id}
                                    disabled={
                                        availableBatches(m, used).length === 0
                                    }
                                >
                                    {m.name}
                                    {availableBatches(m, used).length === 0
                                        ? ' (out of stock)'
                                        : ''}
                                </option>
                            ))}
                        </select>
                        {errors.medicine && (
                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                {errors.medicine}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <span className={FIELD_LABEL}>Assigned batch</span>
                            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold tracking-wider text-[#1b5e4a] uppercase">
                                FEFO Priority
                            </span>
                        </div>
                        <div className="mt-2 flex min-h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-[13px] text-slate-800 uppercase">
                            {!medicine ? (
                                <span className="text-slate-400 normal-case">
                                    Select a medicine to assign a batch
                                </span>
                            ) : !batch ? (
                                <span className="text-slate-400 normal-case">
                                    No batch with stock available
                                </span>
                            ) : (
                                `Batch ${batch.batchNo} — Exp: ${batch.expiry} — Stock: ${fmt(batch.stock)} units`
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="dispense-qty" className={FIELD_LABEL}>
                            Quantity to dispense
                        </label>
                        <div className="mt-2 flex items-center gap-4">
                            <input
                                id="dispense-qty"
                                type="number"
                                min={1}
                                max={batch?.stock}
                                value={quantity}
                                disabled={!batch}
                                onChange={(e) => {
                                    setQuantity(e.target.value);
                                    setErrors((x) => ({
                                        ...x,
                                        quantity: undefined,
                                    }));
                                }}
                                className={`${DISPENSE_INPUT} w-24 px-2 text-center text-lg font-bold`}
                            />
                            <span className={`${FIELD_LABEL} text-slate-400`}>
                                Units
                            </span>
                        </div>
                        {errors.quantity && (
                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                {errors.quantity}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-10 cursor-pointer rounded-lg border border-slate-200 bg-white px-6 text-xs font-bold tracking-widest text-slate-500 uppercase transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!batch}
                        className="h-10 cursor-pointer rounded-lg bg-[#1b5e4a] px-6 text-xs font-bold tracking-widest text-white uppercase transition hover:bg-[#164c3c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b5e4a] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Confirm Dispense
                    </button>
                </div>
            </form>
        </Overlay>
    );
}

export default function Releasing() {
    const { data, loading } = useReleasingData();
    const [added, setAdded] = useState<PatientRecord[]>([]);
    const [used, setUsed] = useState<Record<number, number>>({});
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

    const d = data ?? EMPTY_DATA;
    const all = [...added, ...d.patients];
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

    const saveNewPatient = (record: PatientRecord) => {
        setAdded((prev) => [{ ...record, id: nextId.current-- }, ...prev]);
        clearFilters();
        setModal(null);
        // TODO: POST the new record to the backend, e.g. router.post('/patients', record)
    };

    const confirmDispense = (patient: PatientRecord, r: DispenseResult) => {
        setUsed((prev) => ({
            ...prev,
            [r.batch.id]: (prev[r.batch.id] ?? 0) + r.quantity,
        }));
        setModal(null);
        toast.success('Medicine dispensed', {
            description: `${fmt(r.quantity)} units of ${r.medicine.name} (Batch ${r.batch.batchNo}) to ${patient.lastName}, ${patient.firstName}.`,
        });
        // TODO: POST the transaction to the backend, e.g.
        // router.post('/releasing', { patient_id: patient.id, batch_id: r.batch.id, quantity: r.quantity })
    };

    const sortable = (key: SortKey, label: string) => (
        <th key={key} className={TH}>
            <button
                type="button"
                disabled={controlsOff}
                onClick={() => toggleSort(key)}
                className="cursor-pointer font-[inherit] tracking-[inherit] uppercase hover:text-slate-900 disabled:cursor-not-allowed"
            >
                {label}
                {sortArrow(key)}
            </button>
        </th>
    );

    return (
        <>
            <Head title="Releasing" />
            <main className="dashboard-canvas flex min-h-full flex-col gap-4 text-slate-900">
                <section className={`${CARD} px-5 py-4`}>
                    <div className="flex flex-wrap items-center gap-3">
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
                                onClick={() => setModal({ type: 'form' })}
                                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-[#043d2b] px-5 text-xs font-bold tracking-wide text-white uppercase transition hover:bg-[#012b1d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#043d2b] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Plus className="size-4" />
                                New Patient Record
                            </button>
                        </div>
                    </div>
                </section>

                <section
                    className={`${CARD} flex min-h-140 flex-1 flex-col overflow-hidden`}
                >
                    <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-4">
                        <div>
                            <h2 className="text-[17px] font-bold text-slate-900">
                                Daily Patient Releasing Log
                            </h2>
                            <p className="mt-0.5 text-[13px] text-slate-400">
                                Active queue for dispensing inventory to
                                registered patients
                            </p>
                        </div>
                        {loading ? (
                            <Skeleton className="h-8 w-44" />
                        ) : (
                            <span className="rounded-md border border-slate-200 bg-slate-50 px-4 py-1.5 text-[13px] text-slate-400">
                                {total === 0 ? (
                                    'No records'
                                ) : (
                                    <>
                                        Showing{' '}
                                        <b className="font-bold text-slate-800">
                                            {fmt(start + 1)}–
                                            {fmt(Math.min(start + pageSize, total))}
                                        </b>{' '}
                                        of{' '}
                                        <b className="font-bold text-slate-800">
                                            {fmt(total)}
                                        </b>{' '}
                                        records
                                    </>
                                )}
                            </span>
                        )}
                    </header>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full min-w-250 border-collapse">
                            <thead>
                                <tr>
                                    {sortable('lastName', 'Last name')}
                                    {sortable('firstName', 'First name')}
                                    {sortable('middleName', 'Middle name')}
                                    <th className={`${TH} text-center`}>Ext</th>
                                    {sortable('birthdate', 'Birthdate')}
                                    <th className={`${TH} text-center`}>
                                        <button
                                            type="button"
                                            disabled={controlsOff}
                                            onClick={() => toggleSort('age')}
                                            className="cursor-pointer font-[inherit] tracking-[inherit] uppercase hover:text-slate-900 disabled:cursor-not-allowed"
                                        >
                                            Age{sortArrow('age')}
                                        </button>
                                    </th>
                                    <th className={TH}>Contact number</th>
                                    {sortable('barangay', 'Barangay')}
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
                                                            className={`h-4 ${j === 8 ? 'mx-auto w-24' : j === 5 ? 'mx-auto w-6' : j === 3 ? 'mx-auto w-5' : 'w-24'}`}
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
                                                        No patients in the
                                                        releasing queue
                                                    </div>
                                                    <div className="mt-1 text-[11px] text-slate-400">
                                                        Registered patients will
                                                        appear here. You can also
                                                        use “New Patient Record”.
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
                                                className={`${TD} font-bold text-slate-900`}
                                            >
                                                {p.lastName}
                                            </td>
                                            <td className={TD}>
                                                {p.firstName}
                                            </td>
                                            <td className={TD}>
                                                {p.middleName ?? (
                                                    <span className="text-slate-300">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td
                                                className={`${TD} text-center`}
                                            >
                                                {p.ext ?? (
                                                    <span className="text-slate-300">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className={TD}>
                                                {p.birthdate}
                                            </td>
                                            <td
                                                className={`${TD} text-center font-bold`}
                                            >
                                                {ageOf(p.birthdate)}
                                            </td>
                                            <td className={TD}>
                                                {p.contactNumber ?? (
                                                    <span className="text-slate-300">
                                                        N/A
                                                    </span>
                                                )}
                                            </td>
                                            <td className={TD}>
                                                {p.barangay}
                                            </td>
                                            <td
                                                className={`${TD} text-center`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setModal({
                                                            type: 'dispense',
                                                            patient: p,
                                                        })
                                                    }
                                                    className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-emerald-900 normal-case transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                                                >
                                                    <FileText className="size-3.5" />
                                                    Dispense
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 text-[13px] text-slate-500">
                        <label className="flex items-center gap-2">
                            Records per page:
                            <span className="relative">
                                <select
                                    value={pageSize}
                                    disabled={controlsOff}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="h-9 cursor-pointer appearance-none rounded-md border border-slate-200 bg-white pr-8 pl-3 font-semibold text-slate-800 focus:border-emerald-800 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {PAGE_SIZES.map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-slate-500" />
                            </span>
                        </label>

                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="mr-3 text-slate-600">
                                {loading || total === 0 ? (
                                    '—'
                                ) : (
                                    <>
                                        <b className="font-semibold text-slate-800">
                                            {fmt(start + 1)}–
                                            {fmt(Math.min(start + pageSize, total))}
                                        </b>{' '}
                                        of{' '}
                                        <b className="font-semibold text-slate-800">
                                            {fmt(total)}
                                        </b>
                                    </>
                                )}
                            </span>
                            <button
                                type="button"
                                aria-label="First page"
                                disabled={controlsOff || current === 1}
                                onClick={() => setPage(1)}
                                className={PAGER}
                            >
                                <ChevronsLeft className="size-4" />
                            </button>
                            <button
                                type="button"
                                aria-label="Previous page"
                                disabled={controlsOff || current === 1}
                                onClick={() => setPage(current - 1)}
                                className={PAGER}
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
                                        className={`${PAGER} ${n === current && !controlsOff ? 'border-[#0b4a35] bg-[#0b4a35] font-bold text-white hover:bg-[#0b4a35]' : ''}`}
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
                                className={PAGER}
                            >
                                <ChevronRight className="size-4" />
                            </button>
                            <button
                                type="button"
                                aria-label="Last page"
                                disabled={controlsOff || current === totalPages}
                                onClick={() => setPage(totalPages)}
                                className={PAGER}
                            >
                                <ChevronsRight className="size-4" />
                            </button>
                        </div>
                    </footer>
                </section>
            </main>

            {modal?.type === 'form' && (
                <PatientFormDialog
                    patient={null}
                    existing={all}
                    onClose={() => setModal(null)}
                    onSave={saveNewPatient}
                />
            )}
            {modal?.type === 'dispense' && (
                <DispenseDialog
                    patient={modal.patient}
                    medicines={d.medicines}
                    used={used}
                    onClose={() => setModal(null)}
                    onConfirm={(r) => confirmDispense(modal.patient, r)}
                />
            )}
        </>
    );
}

Releasing.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;