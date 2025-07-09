import { useState } from "react"
import { router } from "@inertiajs/react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "./ui/alert"
import { ApprovalStatus, Post } from "@/types/post"
import { TextArea } from "@/components/ui/textarea"

export function ApproveDialog({ post, onApprove }: { post: Post, onApprove?: (remark: string) => void }) {
    const [open, setOpen] = useState(false)
    const [approvalBtnState, setApprovalBtnState] = useState(true)
    const [remark, setRemark] = useState("")
    const [alert, setAlert] = useState<{
        variant?: "default" | "destructive"
        title?: string
        description?: string
    } | null>(null)

    function handleApprove() {
        setApprovalBtnState(false)
        const id = post.id

        const handleSuccess = () => {
            setAlert({
                variant: "default",
                title: "Success",
                description: "Post approved successfully.",
            })
            if (onApprove) onApprove(remark)
        }

        const handleError = (errors: any) => {
            setAlert({
                variant: "destructive",
                title: "Error",
                description: `${errors.message ? errors.message
                    : errors.approval_status ? errors.approval_status
                        : errors.remarks ? errors.remarks
                            : errors.id ? errors.id
                                : "Something went wrong. Please try again. "}`,
            })
        }

        if (remark.length !== 0) {
            router.put(`/posts/${id}/remark`, { remark }, {
                preserveScroll: true,
                onSuccess: () => {
                    router.put(`/posts/${id}/approval-status`, { approval_status: ApprovalStatus.approved }, {
                        preserveScroll: true,
                        onSuccess: handleSuccess,
                        onError: handleError,
                    })
                },
                onError: handleError,
            })
        } else {
            router.put(`/posts/${id}/approval-status`, { approval_status: ApprovalStatus.approved }, {
                preserveScroll: true,
                onSuccess: handleSuccess,
                onError: handleError,
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="approve">Approve</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Approve Post</DialogTitle>
                    <DialogDescription>
                        Please provide an optional remark.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <TextArea
                        placeholder="Enter your approval remark..."
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        className="w-full min-h-[100px]"
                    />
                </div>

                <div className="space-y-4">
                    {alert && (
                        <Alert variant={alert.variant}>
                            <AlertTitle>{alert.title}</AlertTitle>
                            <AlertDescription>{alert.description}</AlertDescription>
                        </Alert>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button variant="approve" onClick={handleApprove} disabled={!approvalBtnState}>
                        Approve
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
