import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { usePage } from '@inertiajs/react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RemarksDialog } from "@/components/dialog-remarks"
import { SourceDialog } from "@/components/dialog-post-idea"
import { ApproveDialog } from "@/components/dialog-approve"
import { DenyDialog } from "./dialog-deny"
import {
    ApprovalStatus,
    MaterialStatus,
    Post,
    MapRawPost,
    ApprovalStatusVariants,
    ApprovalStatusLabels,
    PostStatusVariants,
    PostStatusLabels,
    MaterialStatusLabels,
    MaterialStatusVariants,
    PostStatusProperLabels,
    MaterialStatusProperLabels,
    ApprovalStatusProperLabels,
    PostStatus,
} from '@/types/post'
import { SharedData } from '@/types'
import { UserRole } from "@/types/enums"
import { useMemo, useState } from "react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { UpdateButtonDialog } from "./dialog-update"
import { AddRemarksDialog } from "./dialog-add-remark"

interface PlaceholderPatternProps {
    className?: string;
}

function ShouldShowShowButton(): boolean {
    return true;
}

function ShouldShowApproveButton(roles: UserRole[], approval_status: ApprovalStatus): boolean {
    return (roles.includes(UserRole.Reviewer) || roles.includes(UserRole.Lead) || roles.includes(UserRole.Admin)) && (approval_status == ApprovalStatus.pending);
}

function ShouldShowDenyButton(roles: UserRole[], approval_status: ApprovalStatus): boolean {
    return (roles.includes(UserRole.Reviewer) || roles.includes(UserRole.Lead) || roles.includes(UserRole.Admin)) && (approval_status == ApprovalStatus.pending);
}

function ShouldShowRemarksButton(material_status: MaterialStatus): boolean {
    return material_status == MaterialStatus.completed;
}

function ShouldShowUpdateButton(status: PostStatus): boolean {
    return (status == PostStatus.delayed || status == PostStatus.notStarted || status == PostStatus.pending);
}

function ShouldShowAddRemarkButton(roles: UserRole[]): boolean {
    return roles.includes(UserRole.Admin) || roles.includes(UserRole.Reviewer);
}

export function PostsTable({ className }: PlaceholderPatternProps) {
    const page = usePage();
    const roles = usePage<SharedData>().props.auth.user.roles;
    const props = page.props;

    const [searchText, setSearchText] = useState('');
    const [approvalFilter, setApprovalFilter] = useState<string | 'all'>('all');
    const [postStatusFilter, setPostStatusFilter] = useState<string | 'all'>('all');
    const [materialStatusFilter, setMaterialStatusFilter] = useState<string | 'all'>('all');
    const [sortField, setSortField] = useState<'planned_post_date' | 'actual_post_date' | 'description'>('planned_post_date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const rawPosts: Post[] = ((props.posts ?? []) as any[]).map(MapRawPost);

    const filteredAndSortedPosts = useMemo(() => {
        let filtered = rawPosts;

        if (searchText.trim() !== '') {
            const text = searchText.toLowerCase();
            filtered = filtered.filter(post =>
                post.description.toLowerCase().includes(text) ||
                post.category.toLowerCase().includes(text) ||
                post.caption.toLowerCase().includes(text)
            );
        }

        if (approvalFilter !== 'all') {
            filtered = filtered.filter(post => post.approval_status === approvalFilter as unknown);
        }

        if (postStatusFilter !== 'all') {
            filtered = filtered.filter(post => post.post_status === postStatusFilter as unknown);
        }

        if (materialStatusFilter !== 'all') {
            filtered = filtered.filter(post => post.material_status === materialStatusFilter as unknown);
        }

        filtered.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];

            if (valA instanceof Date && valB instanceof Date) {
                return sortDirection === 'asc'
                    ? valA.getTime() - valB.getTime()
                    : valB.getTime() - valA.getTime();
            }

            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortDirection === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }

            return 0;
        });

        return filtered;
    }, [rawPosts, searchText, approvalFilter, postStatusFilter, materialStatusFilter, sortField, sortDirection]);

    return (
        <div className={className + " px-4"} >
            <div className="flex flex-wrap justify-end gap-4 mb-4 mt-4 mr-4">
                {/* Search */}
                <Input
                    placeholder="Search posts..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-48"
                />

                {/* Approval Status Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Approval: {approvalFilter === 'all' ? 'All' : ApprovalStatusLabels[approvalFilter]}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setApprovalFilter('all')}>All</DropdownMenuItem>
                        {Object.entries(ApprovalStatusLabels).map(([key, label]) => (
                            <DropdownMenuItem key={key} onSelect={() => setApprovalFilter(key)}>
                                {label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Post Status Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Post: {postStatusFilter === 'all' ? 'All' : PostStatusLabels[postStatusFilter]}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setPostStatusFilter('all')}>All</DropdownMenuItem>
                        {Object.entries(PostStatusLabels).map(([key, label]) => (
                            <DropdownMenuItem key={key} onSelect={() => setPostStatusFilter(key)}>
                                {label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Material Status Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Material: {materialStatusFilter === 'all' ? 'All' : MaterialStatusLabels[materialStatusFilter]}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setMaterialStatusFilter('all')}>All</DropdownMenuItem>
                        {Object.entries(MaterialStatusLabels).map(([key, label]) => (
                            <DropdownMenuItem key={key} onSelect={() => setMaterialStatusFilter(key)}>
                                {label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Field */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Sort: {sortField === 'description' ? 'Description' : sortField === 'actual_post_date' ? 'Actual Date' : 'Planned Date'}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setSortField('planned_post_date')}>Planned Date</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSortField('actual_post_date')}>Actual Date</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSortField('description')}>Description</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Direction */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Direction: {sortDirection === 'asc' ? 'Asc' : 'Desc'}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setSortDirection('asc')}>Ascending</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSortDirection('desc')}>Descending</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {filteredAndSortedPosts.length === 0 ? (
                <p className="text-center text-gray-500">No results found</p>
            ) : (
                <Table className="table-fixed w-full min-w-[768px] mb-8">
                    <TableCaption>
                        Showing {filteredAndSortedPosts.length} Posting {filteredAndSortedPosts.length === 1 ? "Idea" : "Ideas"}.
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/2">Post Idea</TableHead>
                            <TableHead className="w-1/5">Planned/Posted Date</TableHead>
                            <TableHead className="w-1/10 text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedPosts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell className="w-1/2 align-top">
                                    <div className="font-medium break-words whitespace-normal">{post.description}</div>
                                    <div className="text-sm text-muted-foreground break-words whitespace-normal mt-1">
                                        {post.category} &mdash; <span className="italic">{post.caption ? post.caption : "No Caption"}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge variant={ApprovalStatusVariants[post.approval_status]}>
                                            {ApprovalStatusProperLabels[post.approval_status]}
                                        </Badge>

                                        <Badge variant={PostStatusVariants[post.post_status]}>
                                            {PostStatusProperLabels[post.post_status]}
                                        </Badge>

                                        <Badge variant={MaterialStatusVariants[post.material_status]}>
                                            {MaterialStatusProperLabels[post.material_status]}
                                        </Badge>

                                    </div>
                                </TableCell>
                                <TableCell className="w-1/5 align-top text-sm text-muted-foreground">
                                    {post.planned_post_date
                                        ? new Date(post.planned_post_date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                        : "N/A"}{" "}
                                    &mdash;{" "}
                                    <span>
                                        {post.actual_post_date
                                            ? new Date(post.actual_post_date).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                            : "N/A"}
                                    </span>
                                </TableCell>
                                <TableCell className="w-1/10 align-top text-center">
                                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                                        {ShouldShowShowButton() && <SourceDialog post={post} />}
                                        {ShouldShowApproveButton(roles, post.approval_status) && <ApproveDialog post={post} />}
                                        {ShouldShowDenyButton(roles, post.approval_status) && <DenyDialog post={post} />}
                                        {ShouldShowRemarksButton(post.material_status) && <RemarksDialog post={post} />}
                                        {ShouldShowUpdateButton(post.post_status) && (
                                            <UpdateButtonDialog post={post} roles={roles} />
                                        )}
                                        {ShouldShowAddRemarkButton(roles) && <AddRemarksDialog post={post} />}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}
