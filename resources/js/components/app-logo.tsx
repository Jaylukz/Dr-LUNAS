import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-[#083e2c] text-emerald-100">
                <AppLogoIcon className="size-5 fill-current text-emerald-100 dark:text-emerald-100" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-xl font-semibold">
                <span className="mb-0.5 truncate leading-tight font-semibold text-emerald-100">
                    {name}
                </span>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-emerald-200 uppercase">
                    CHO of Tagum City
                </span>
            </div>
        </>
    );
}
