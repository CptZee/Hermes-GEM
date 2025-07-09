import { useState } from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Post } from "@/types/post"

export function RemarksDialog({ post }: { post: Post }) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="remarks" onClick={() => setOpen(true)}>
                    Remarks
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Post Remarks</DialogTitle>
                    <DialogDescription>
                        Remarks related to this post.
                    </DialogDescription>
                </DialogHeader>

                <div className="text-sm whitespace-pre-wrap text-muted-foreground max-h-96 overflow-y-auto border p-3 rounded-md bg-muted">
                    {post.remarks ? post.remarks : "No remarks available."}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
