import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
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
import '../../css/dashboard.css';

interface PatientRecord {
    id: number;
    lastName: string;
    firstName: string;
    middleName: string | null;
    ext: string | null;
    birthdate: string;
    contactNumber: string | null;
    barangay: string;
    recordDate: string;
}

interface DispenseRecord {
    id: number;
    date: string;
    medicine: string;
    quantity: string;
    releasedBy: string;
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

const EXTENSIONS = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];
const PAGE_SIZES = [10, 25, 50, 100];

// Tagum City barangays — please verify against the CHO's official list.
const BARANGAYS = [
    'Apokon',
    'Bincungan',
    'Busaon',
    'Canocotan',
    'Cuambogan',
    'La Filipina',
    'Liboganon',
    'Madaum',
    'Magdum',
    'Magugpo East',
    'Magugpo North',
    'Magugpo Poblacion',
    'Magugpo South',
    'Magugpo West',
    'Mankilam',
    'New Balamban',
    'Nueva Fuerza',
    'Pagsabangan',
    'Pandapan',
    'San Agustin',
    'San Isidro',
    'San Miguel',
    'Visayan Village',
];

const fmt = (n: number) => n.toLocaleString('en-US');

const todayIso = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const ageOf = (iso: string) => {
    const born = new Date(`${iso}T00:00:00`);
    const now = new Date();
    let age = now.getFullYear() - born.getFullYear();
    const beforeBirthday =
        now.getMonth() < born.getMonth() ||
        (now.getMonth() === born.getMonth() && now.getDate() < born.getDate());
    if (beforeBirthday) age -= 1;
    return Math.max(0, age);
};

const fmtDate = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });

function pageList(current: number, total: number): (number | 'gap')[] {
    const wanted = new Set(
        [1, 2, 3, total, current - 1, current, current + 1].filter(
            (n) => n >= 1 && n <= total,
        ),
    );
    const sorted = [...wanted].sort((a, b) => a - b);
    const out: (number | 'gap')[] = [];
    sorted.forEach((n, i) => {
        if (i > 0 && n - sorted[i - 1] > 1) out.push('gap');
        out.push(n);
    });
    return out;
}

const CARD = 'rounded-xl border border-emerald-200 bg-white shadow-sm';
const TH =
    'h-[38px] whitespace-nowrap border-b border-slate-200 bg-slate-50/60 px-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500';
const TD =
    'h-[53px] whitespace-nowrap border-b border-slate-100 px-3 text-left text-[13px] uppercase';
const INPUT =
    'h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-emerald-800 focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:outline-none';
const TOOLBAR_INPUT =
    'h-9 rounded-lg border border-slate-200 bg-slate-100/70 px-3 text-[13px] font-semibold text-slate-700 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';
const PAGER_BTN =
    'grid size-8 cursor-pointer place-items-center rounded-md text-[13px] font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent';

function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
        />
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-1 block text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                {label}
            </span>
            {children}
            {error && (
                <span className="mt-1 block text-[11px] font-medium text-red-600">
                    {error}
                </span>
            )}
        </label>
    );
}

function Dialog({
    title,
    wide,
    onClose,
    children,
}: {
    title: string;
    wide?: boolean;
    onClose: () => void;
    children: ReactNode;
}) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={`${CARD} max-h-[90vh] w-full overflow-y-auto p-5 ${wide ? 'max-w-2xl' : 'max-w-lg'}`}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-bold">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X className="size-4" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

interface PatientForm {
    lastName: string;
    firstName: string;
    middleName: string;
    ext: string;
    birthdate: string;
    contactNumber: string;
    barangay: string;
}

type FormErrors = Partial<Record<keyof PatientForm, string>>;

const toForm = (p: PatientRecord | null): PatientForm => ({
    lastName: p?.lastName ?? '',
    firstName: p?.firstName ?? '',
    middleName: p?.middleName ?? '',
    ext: p?.ext ?? '',
    birthdate: p?.birthdate ?? '',
    contactNumber: p?.contactNumber ?? '',
    barangay: p?.barangay ?? '',
});

const sameText = (a: string | null, b: string) =>
    (a ?? '').trim().toLowerCase() === b.trim().toLowerCase();

function PatientFormDialog({
    patient,
    existing,
    onClose,
    onSave,
}: {
    patient: PatientRecord | null;
    existing: PatientRecord[];
    onClose: () => void;
    onSave: (record: PatientRecord) => void;
}) {
    const [form, setForm] = useState<PatientForm>(toForm(patient));
    const [errors, setErrors] = useState<FormErrors>({});
    const firstField = useRef<HTMLInputElement>(null);

    useEffect(() => {
        firstField.current?.focus();
    }, []);

    const set = (key: keyof PatientForm, value: string) => {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const next: FormErrors = {};
        const contact = form.contactNumber.replace(/[\s-]/g, '');

        if (!form.lastName.trim()) next.lastName = 'Enter the last name.';
        if (!form.firstName.trim()) next.firstName = 'Enter the first name.';
        if (!form.birthdate) next.birthdate = 'Pick the birthdate.';
        else if (form.birthdate > todayIso())
            next.birthdate = 'Birthdate cannot be in the future.';
        if (contact && !/^09\d{9}$/.test(contact))
            next.contactNumber = 'Use the format 09XXXXXXXXX.';
        if (!form.barangay.trim()) next.barangay = 'Enter the barangay.';

        if (Object.keys(next).length === 0) {
            const duplicate = existing.some(
                (p) =>
                    p.id !== patient?.id &&
                    sameText(p.lastName, form.lastName) &&
                    sameText(p.firstName, form.firstName) &&
                    sameText(p.middleName, form.middleName) &&
                    p.birthdate === form.birthdate,
            );
            if (duplicate)
                next.lastName =
                    'A patient with the same name and birthdate already exists.';
        }

        setErrors(next);
        if (Object.keys(next).length > 0) return;

        onSave({
            id: patient?.id ?? 0,
            lastName: form.lastName.trim().toUpperCase(),
            firstName: form.firstName.trim().toUpperCase(),
            middleName: form.middleName.trim().toUpperCase() || null,
            ext: form.ext || null,
            birthdate: form.birthdate,
            contactNumber: contact || null,
            barangay: form.barangay.trim().toUpperCase(),
            recordDate: patient?.recordDate ?? todayIso(),
        });
    };

    return (
        <Dialog
            title={patient ? 'Edit Patient Record' : 'New Patient Record'}
            onClose={onClose}
        >
            <form onSubmit={submit} noValidate>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Last name" error={errors.lastName}>
                        <input
                            ref={firstField}
                            value={form.lastName}
                            onChange={(e) => set('lastName', e.target.value)}
                            className={INPUT}
                        />
                    </Field>
                    <Field label="First name" error={errors.firstName}>
                        <input
                            value={form.firstName}
                            onChange={(e) => set('firstName', e.target.value)}
                            className={INPUT}
                        />
                    </Field>
                    <Field label="Middle name (optional)">
                        <input
                            value={form.middleName}
                            onChange={(e) => set('middleName', e.target.value)}
                            className={INPUT}
                        />
                    </Field>
                    <Field label="Ext. (optional)">
                        <select
                            value={form.ext}
                            onChange={(e) => set('ext', e.target.value)}
                            className={`${INPUT} cursor-pointer`}
                        >
                            <option value="">None</option>
                            {EXTENSIONS.map((x) => (
                                <option key={x}>{x}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Birthdate" error={errors.birthdate}>
                        <input
                            type="date"
                            max={todayIso()}
                            value={form.birthdate}
                            onChange={(e) => set('birthdate', e.target.value)}
                            className={INPUT}
                        />
                    </Field>
                    <Field
                        label="Contact number (optional)"
                        error={errors.contactNumber}
                    >
                        <input
                            type="tel"
                            inputMode="tel"
                            value={form.contactNumber}
                            onChange={(e) =>
                                set('contactNumber', e.target.value)
                            }
                            placeholder="09XXXXXXXXX"
                            className={INPUT}
                        />
                    </Field>
                    <div className="sm:col-span-2">
                        <Field label="Barangay" error={errors.barangay}>
                            <input
                                list="barangay-options"
                                value={form.barangay}
                                onChange={(e) =>
                                    set('barangay', e.target.value)
                                }
                                placeholder="Select or type a barangay"
                                className={INPUT}
                            />
                            <datalist id="barangay-options">
                                {BARANGAYS.map((b) => (
                                    <option key={b} value={b} />
                                ))}
                            </datalist>
                        </Field>
                    </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-8.5 cursor-pointer rounded-lg bg-slate-100 px-5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="h-8.5 cursor-pointer rounded-lg bg-[#043d2b] px-5 text-xs font-bold text-white transition hover:bg-[#012b1d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#043d2b]"
                    >
                        {patient ? 'Save Changes' : 'Add Record'}
                    </button>
                </div>
            </form>
        </Dialog>
    );
}

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

    const fullName = [
        patient.lastName + ',',
        patient.firstName,
        patient.middleName,
        patient.ext,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Dialog title="Patient History" wide onClose={onClose}>
            <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-sm font-bold text-emerald-900 uppercase">
                    {fullName}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                    {ageOf(patient.birthdate)} yrs · Born{' '}
                    {fmtDate(patient.birthdate)} · Brgy. {patient.barangay}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-120 border-collapse text-left">
                    <thead>
                        <tr className="border-b border-slate-200 text-[10.5px] font-semibold tracking-wider text-slate-400 uppercase">
                            <th className="pr-2 pb-2 font-semibold">Date</th>
                            <th className="pr-2 pb-2 font-semibold">
                                Medicine
                            </th>
                            <th className="pr-2 pb-2 font-semibold">
                                Quantity
                            </th>
                            <th className="pb-2 font-semibold">Released by</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records === null ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr
                                    key={i}
                                    aria-busy="true"
                                    className="border-b border-slate-100"
                                >
                                    {Array.from({ length: 4 }).map((__, j) => (
                                        <td key={j} className="h-11 pr-2">
                                            <Skeleton className="h-4 w-24" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : records.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="h-40 text-center text-sm font-semibold text-slate-500"
                                >
                                    No dispensing history recorded for this
                                    patient
                                </td>
                            </tr>
                        ) : (
                            records.map((r) => (
                                <tr
                                    key={r.id}
                                    className="border-b border-slate-100 text-[13px] text-slate-700"
                                >
                                    <td className="h-11 pr-2 whitespace-nowrap">
                                        {fmtDate(r.date)}
                                    </td>
                                    <td className="pr-2 font-semibold">
                                        {r.medicine}
                                    </td>
                                    <td className="pr-2">{r.quantity}</td>
                                    <td>{r.releasedBy}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Dialog>
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