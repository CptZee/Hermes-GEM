import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({
    value,
    onChange,
    placeholder = "Select date",
}: {
    value?: Date | null
    onChange: (date: Date | undefined) => void
    placeholder?: string
}) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`w-full justify-between font-normal ${!(value instanceof Date && !isNaN(value.getTime())) ? "text-muted-foreground" : ""}`}
                >
                    {value instanceof Date && !isNaN(value.getTime())
                        ? value.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })
                        : placeholder}
                    <ChevronDownIcon className="ml-2 size-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                side="right"
                align="start"
                className="w-auto p-0 z-100"
                sideOffset={-248}
                alignOffset={64}

            >
                <Calendar
                    mode="single"
                    selected={value ?? undefined} // ✅ FIX
                    captionLayout="dropdown"
                    onSelect={(selectedDate) => {
                        console.log("Selected")
                        onChange(selectedDate)
                        setOpen(false)
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
