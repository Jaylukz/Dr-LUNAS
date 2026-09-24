import { usePage } from '@inertiajs/react';

export function NavUser() {
    const page = usePage();
    const user = (page.props as any).auth?.user;

    return (
        <div className="flex items-center gap-2 px-3 py-2 text-sm">
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                    {user?.name || 'User'}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                    {user?.email || ''}
                </span>
            </div>
        </div>
    );
}

export default NavUser;
