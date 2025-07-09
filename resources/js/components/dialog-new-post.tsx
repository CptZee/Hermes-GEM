import { useState } from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/textarea"
import { router } from "@inertiajs/react"

import { MaterialStatusDropdown } from "@/components/dropdown-material-status"
import { DatePicker } from "@/components/ui/data-picker"

export function AddPostDialog() {
    const [form, setForm] = useState({
        description: "",
        category: "",
        caption: "",
        type: "",
        planned_post_date: null,
        material_status: null,
        post_link: "",
        source: "",
    })
    const [alert, setAlert] = useState<{
        variant?: "default" | "destructive" | "success"
        title?: string
        description?: string
    } | null>(null)

    const isFormValid = () => {
        return (
            form.category.trim() !== "" &&
            form.type.trim() !== "" &&
            form.planned_post_date !== null &&
            form.material_status !== null &&
            form.description.trim() !== "" &&
            form.caption.trim() !== ""
        )
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleDateChange = (name: string, date: Date | undefined) => {
        setForm((prev) => ({
            ...prev,
            [name]: date,
        }))
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

    const handleSubmit = () => {
        router.put("/posts/new", {
            category: form.category,
            type: form.type,
            source: form.source,
            planned_post_date: form.planned_post_date,
            material_status: form.material_status,
            description: form.description,
            caption: form.caption,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAlert({
                    variant: "success",
                    title: "Success",
                    description: "Post added successfully.",
                })
            },
            onError: handleError,
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>New Post</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Post</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <Input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
                    <Input name="type" placeholder="Type" value={form.type} onChange={handleChange} />
                    <DatePicker
                        value={form.planned_post_date}
                        onChange={(date) => handleDateChange("planned_post_date", date)}
                        placeholder="Planned Posting Date"
                    />
                    <MaterialStatusDropdown name="material_status" value={form.material_status} onChange={handleChange} />
                    <Input name="source" placeholder="Source" value={form.source} onChange={handleChange} />
                    <TextArea className="h-32" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
                    <TextArea className="h-32" name="caption" placeholder="Caption" value={form.caption} onChange={handleChange} />
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
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={!isFormValid()}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
