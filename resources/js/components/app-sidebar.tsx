import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Mail, LayoutGrid, NotebookPen } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { UserRole } from '@/types/enums';
import AppLogo from './app-logo';

const revieweeItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Post Ideas',
        href: '/posts',
        icon: NotebookPen,
    },
];

const leadItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Post Ideas',
        href: '/posts',
        icon: NotebookPen,
    },
];

const reviewerItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Post Ideas',
        href: '/posts',
        icon: NotebookPen,
    },
];

const adminItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Post Ideas',
        href: '/posts',
        icon: NotebookPen,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Web Mail',
        href: 'https://webmail.gemcodeit.com',
        icon: Mail,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={auth.user.roles.includes(UserRole.Admin) ? adminItems :
                    auth.user.roles.includes(UserRole.Reviewer) ? reviewerItems :
                        auth.user.roles.includes(UserRole.Lead) ? leadItems :
                            revieweeItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
