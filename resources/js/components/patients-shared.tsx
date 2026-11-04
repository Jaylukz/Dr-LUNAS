import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export interface PatientRecord {
    id: number;
    patientNo: string | null;
    lastName: string;
    firstName: string;
    middleName: string | null;
    ext: string | null;
    birthdate: string;
    contactNumber: string | null;
    barangay: string;
    recordDate: string;
}

export const PAGE_SIZES = [10, 25, 50, 100];
const EXTENSIONS = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];

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

export const fmt = (n: number) => n.toLocaleString('en-US');

export const todayIso = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const ageOf = (iso: string) => {
    const born = new Date(`${iso}T00:00:00`);
    const now = new Date();
    let age = now.getFullYear() - born.getFullYear();
    const beforeBirthday =
        now.getMonth() < born.getMonth() ||
        (now.getMonth() === born.getMonth() && now.getDate() < born.getDate());
    if (beforeBirthday) age -= 1;
    return Math.max(0, age);
};

export const fmtDate = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });

export function pageList(current: number, total: number): (number | 'gap')[] {
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

export const CARD = 'rounded-xl border border-emerald-200 bg-white shadow-sm';
export const TH =
    'h-[38px] whitespace-nowrap border-b border-slate-200 bg-slate-50/60 px-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500';
export const TD =
    'h-[53px] whitespace-nowrap border-b border-slate-100 px-3 text-left text-[13px] uppercase';
export const INPUT =
    'h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-emerald-800 focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:outline-none';
export const TOOLBAR_INPUT =
    'h-9 rounded-lg border border-slate-200 bg-slate-100/70 px-3 text-[13px] font-semibold text-slate-700 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';
export const PAGER_BTN =
    'grid size-8 cursor-pointer place-items-center rounded-md text-[13px] font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent';

export function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
        />
    );
}

export function Field({
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

export function Overlay({
    label,
    onClose,
    className,
    children,
}: {
    label: string;
    onClose: () => void;
    className: string;
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
                aria-label={label}
                className={className}
            >
                {children}
            </div>
        </div>
    );
}

export function Dialog({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: ReactNode;
}) {
    return (
        <Overlay
            label={title}
            onClose={onClose}
            className={`${CARD} max-h-[90vh] w-full max-w-lg overflow-y-auto p-5`}
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
        </Overlay>
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

export function PatientFormDialog({
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
            patientNo: patient?.patientNo ?? null,
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