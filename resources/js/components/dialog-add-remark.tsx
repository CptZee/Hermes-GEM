import * as React from "react"
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

import { Button } from "@/components/ui/button"
import { TextArea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Post } from "@/types/post"

interface AddRemarksDialogProps {
    post: Post
    onSubmitted?: () => void
}

export function AddRemarksDialog({ post, onSubmitted }: AddRemarksDialogProps) {
    const [remark, setRemark] = useState("")
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState<{
        variant?: "default" | "destructive" | "success"
        title?: string
        description?: string
    } | null>(null)

    const handleSubmit = () => {
        setLoading(true)
        router.put(`/posts/${post.id}/remark`, { remark }, {
            onSuccess: () => {
                setRemark("")
                setAlert({
                    variant: "success",
                    title: "Success",
                    description: "Remarks added successfully.",
                })
                if (onSubmitted) onSubmitted()
            },
            onError: (errors: any) => {
                setAlert({
                    variant: "destructive",
                    title: "Error",
                    description: errors.message || "Something went wrong.",
                })
            },
            onFinish: () => setLoading(false),
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">Add Remarks</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Remarks</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-4">
                    <TextArea
                        placeholder="Write remarks here..."
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                    />

                    {alert && (
                        <Alert variant={alert.variant}>
                            <AlertTitle>{alert.title}</AlertTitle>
                            <AlertDescription>{alert.description}</AlertDescription>
                        </Alert>
                    )}

                    <Button onClick={handleSubmit} disabled={loading || !remark.trim()}>
                        Submit Remarks
                    </Button>
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
