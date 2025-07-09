import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { PostsTable } from '@/components/posts-table';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AddPostDialog } from '@/components/dialog-new-post';
import { UserRole } from '@/types/enums';
import { DatePicker } from '@/components/ui/data-picker';
import { ImportPostsDialog } from '@/components/dialog-import';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Post Ideas',
        href: '/posts',
    },
];

export default function Posts() {
    const roles = usePage<SharedData>().props.auth.user.roles;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Post Ideas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">Post Ideas</p>

                    <div className="flex items-center gap-2">
                        <AddPostDialog />
                        {roles.includes(UserRole.Admin) && <ImportPostsDialog />}
                    </div>
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PostsTable className="inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
