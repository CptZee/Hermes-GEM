import { useState } from "react"
import { router } from "@inertiajs/react"

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "./ui/dialog"

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

import {
    ApprovalStatus,
    Post,
    MaterialStatus,
    PostStatus,
} from "@/types/post"
import { UpdateDetailsDialog } from "./dialog-update-post-details"
import { UserRole } from "@/types/enums"

interface UpdateButtonDialogProps {
    post: Post
    roles: UserRole[]
    onUpdate?: () => void
}

function formatStatusLabel(status: string): string {
    return status
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (s) => s.toUpperCase())
}

export function UpdateButtonDialog({ post, roles, onUpdate }: UpdateButtonDialogProps) {
    const isMaterialStatusUpdate =
        post.approval_status === ApprovalStatus.pending ||
        post.approval_status === ApprovalStatus.rejected

    const materialStatusOptions = Object.values(MaterialStatus)
    const postStatusOptions = Object.values(PostStatus)

    const [selectedStatus, setSelectedStatus] = useState<string>(
        isMaterialStatusUpdate ? post.material_status : post.post_status
    )

    const [sourceOrLink, setSourceOrLink] = useState<string>(isMaterialStatusUpdate ? post.source : post.post_link ? post.post_link : "")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState<{
        variant?: "default" | "destructive" | "success"
        title?: string
        description?: string
    } | null>(null)

    const handleUpdate = () => {
        setLoading(true)
        const id = post.id

        const onSuccess = () => {
            setAlert({
                variant: "success",
                title: "Success",
                description: "Post updated successfully.",
            })
            if (onUpdate) onUpdate()
        }

        const onError = (errors: any) => {
            setAlert({
                variant: "destructive",
                title: "Error",
                description:
                    errors.message ||
                    errors.material_status ||
                    errors.post_status ||
                    errors.source ||
                    errors.post_link ||
                    "Something went wrong. Please try again.",
            })
        }

        const route = isMaterialStatusUpdate
            ? `/posts/${id}/material-status`
            : `/posts/${id}/post-status`

        const payload = isMaterialStatusUpdate
            ? { material_status: selectedStatus as MaterialStatus, source: sourceOrLink }
            : { post_status: selectedStatus as PostStatus, post_link: sourceOrLink }

        router.put(route, payload, {
            preserveScroll: true,
            onSuccess,
            onError,
            onFinish: () => {
                setSelectedStatus(isMaterialStatusUpdate ? post.material_status : post.post_status)
                setSourceOrLink(isMaterialStatusUpdate ? post.source : post.post_link ? post.post_link : "")
                setLoading(false)
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="update">Update</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Post</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-4">
                    {roles.includes(UserRole.Reviewee) || roles.includes(UserRole.Lead) ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        {formatStatusLabel(selectedStatus)}
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent>
                                    {(isMaterialStatusUpdate ? materialStatusOptions : postStatusOptions).map(
                                        (status) => (
                                            <DropdownMenuItem
                                                key={status}
                                                onSelect={() => setSelectedStatus(status)}
                                            >
                                                {formatStatusLabel(status)}
                                            </DropdownMenuItem>
                                        )
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Input
                                value={sourceOrLink}
                                onChange={(e) => setSourceOrLink(e.target.value)}
                                placeholder={isMaterialStatusUpdate ? "Enter source link" : "Enter post link"}
                            />

                            {alert && (
                                <Alert variant={alert.variant}>
                                    <AlertTitle>{alert.title}</AlertTitle>
                                    <AlertDescription>{alert.description}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                variant="default"
                                onClick={handleUpdate}
                                disabled={loading || !selectedStatus || !sourceOrLink}
                            >
                                {isMaterialStatusUpdate ? "Update Material Status" : "Update Post Status"}
                            </Button>

                            <UpdateDetailsDialog post={post} />
                        </>
                    ) : (
                        <UpdateDetailsDialog post={post} />
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
