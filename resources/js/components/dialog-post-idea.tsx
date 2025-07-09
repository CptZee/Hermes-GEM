import React, { useState } from "react"
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
import { Post } from "@/types/post" // Adjust based on your type location

export function SourceDialog({ post }: { post: Post }) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="show" onClick={() => setOpen(true)}>
                    Show
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Post Source & Link</DialogTitle>
                    <DialogDescription>
                        Here are the source and published link details for this post.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 text-sm text-muted-foreground break-all">
                    <div>
                        <span className="font-medium text-foreground">Source: {post.source.includes("http") ? <a
                            href={post.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-words"
                        >
                            {post.source}
                        </a> : post.source}</span>
                    </div>
                    <div>
                        <span className="font-medium text-foreground">Post Link: </span>
                        {post.post_link ? (
                            <a
                                href={post.post_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-words"
                            >
                                {post.post_link}
                            </a>
                        ) : (
                            <div className="italic text-muted-foreground">No link available.</div>
                        )}
                    </div>
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
