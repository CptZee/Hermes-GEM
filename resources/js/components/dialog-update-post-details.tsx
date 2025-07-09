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
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/data-picker"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

import { Post } from "@/types/post"

interface UpdateDetailsDialogProps {
    post: Post
    onUpdate?: () => void
}

export function UpdateDetailsDialog({ post, onUpdate }: UpdateDetailsDialogProps) {
    const [description, setDescription] = useState(post.description)
    const [caption, setCaption] = useState(post.caption)
    const [category, setCategory] = useState(post.category)
    const [type, setType] = useState(post.type)
    const [plannedPostDate, setPlannedPostDate] = useState<Date | null>(post.planned_post_date ?? null)
    const [source, setSource] = useState(post.source ?? "")
    const [postLink, setPostLink] = useState(post.post_link ?? "")
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState<{
        variant?: "default" | "destructive" | "success"
        title?: string
        description?: string
    } | null>(null)

    const handleUpdate = () => {
        setLoading(true)

        router.put(`/posts/${post.id}/details`, {
            description,
            caption,
            category,
            type,
            planned_post_date: plannedPostDate,
            source: source || undefined,
            post_link: postLink || undefined,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAlert({
                    variant: "success",
                    title: "Success",
                    description: "Post details updated successfully.",
                })
                if (onUpdate) onUpdate()
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
                <Button variant="secondary">Update Details</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Post Details</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-4">
                    <TextArea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <TextArea
                        placeholder="Caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />

                    <Input
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />

                    <Input
                        placeholder="Type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    />

                    <DatePicker
                        value={plannedPostDate}
                        onChange={(date) => setPlannedPostDate(date ?? null)}
                        placeholder="Planned Posting Date"
                    />

                    {post.post_link && (
                        <Input
                            placeholder="Post Link"
                            value={postLink}
                            onChange={(e) => setPostLink(e.target.value)}
                        />
                    )}

                    {post.source && (
                        <Input
                            placeholder="Source"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                        />
                    )}

                    {alert && (
                        <Alert variant={alert.variant}>
                            <AlertTitle>{alert.title}</AlertTitle>
                            <AlertDescription>{alert.description}</AlertDescription>
                        </Alert>
                    )}

                    <Button onClick={handleUpdate} disabled={loading}>
                        Save Changes
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
