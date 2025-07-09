import { Variant } from "@/components/ui/badge"

export interface Post {
    id?: number | null
    reviewee?: number
    description: string
    category: string
    caption: string
    type: string
    planned_post_date?: Date | null
    actual_post_date?: Date | null
    post_link?: string | null
    source: string
    approval_status: ApprovalStatus
    post_status: PostStatus
    material_status: MaterialStatus
    remarks?: string | null
}

export function MapRawPost(raw: any): Post {
    return {
        id: raw.id !== undefined && raw.id !== null ? Number(raw.id) : null,
        reviewee: raw.reviewee !== undefined && raw.reviewee !== null ? Number(raw.reviewee) : undefined,
        description: String(raw.description ?? ""),
        category: String(raw.category ?? ""),
        caption: String(raw.caption ?? ""),
        type: String(raw.type ?? ""),
        planned_post_date: raw.planned_post_date ? new Date(raw.planned_post_date) : null,
        actual_post_date: raw.actual_post_date ? new Date(raw.actual_post_date) : null,
        post_link: raw.post_link ?? null,
        source: String(raw.source ?? ""),
        approval_status: raw.approval_status as ApprovalStatus,
        post_status: raw.post_status as PostStatus,
        material_status: raw.material_status as MaterialStatus,
        remarks: raw.remarks ?? null,
    };
}

export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected",
}

export enum MaterialStatus {
    completed = "completed",
    inProgress = "inProgress",
    delayed = "delayed",
    notStarted = "notStarted",
}

export enum PostStatus {
    posted = "posted",
    pending = "pending",
    delayed = "delayed",
    notStarted = "notStarted",
}

export const ApprovalStatusLabels: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Denied",
}

export const PostStatusLabels: Record<string, string> = {
    posted: "Posted",
    pending: "In Progress",
    delayed: "Delayed",
    notStarted: "Not Started",
}

export const MaterialStatusLabels: Record<string, string> = {
    notStarted: "Not Started",
    inProgress: "In Progress",
    delayed: "Delayed",
    completed: "Completed",
}

export const ApprovalStatusVariants: Record<string, Variant> = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
};

export const PostStatusVariants: Record<string, Variant> = {
    posted: "posted",
    pending: "pending",
    delayed: "delayed",
    notStarted: "notStarted",
}

export const MaterialStatusVariants: Record<string, Variant> = {
    notStarted: "notStarted",
    inProgress: "inProgress",
    delayed: "delayed",
    completed: "completed",
}

export const ApprovalStatusProperLabels: Record<ApprovalStatus, string> = {
    [ApprovalStatus.pending]: "Pending Approval",
    [ApprovalStatus.approved]: "Approved",
    [ApprovalStatus.rejected]: "Rejected",
}

export const MaterialStatusProperLabels: Record<MaterialStatus, string> = {
    [MaterialStatus.completed]: "Material Completed",
    [MaterialStatus.inProgress]: "Material In Progress",
    [MaterialStatus.delayed]: "Material Delayed",
    [MaterialStatus.notStarted]: "Material Not Started",
}

export const PostStatusProperLabels: Record<PostStatus, string> = {
    [PostStatus.posted]: "Posted",
    [PostStatus.pending]: "Pending Posting",
    [PostStatus.delayed]: "Delayed Posting",
    [PostStatus.notStarted]: "Not Yet Scheduled",
}
