import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MaterialStatus } from "@/types/post" // Adjust the import path
import { useState } from "react"

const materialStatusLabels = {
    [MaterialStatus.completed]: "Completed",
    [MaterialStatus.inProgress]: "In Progress",
    [MaterialStatus.delayed]: "Delayed",
    [MaterialStatus.notStarted]: "Not Started",
}

export function MaterialStatusDropdown({
    name,
    value,
    onChange,
}: {
    name: string
    value: MaterialStatus | null
    onChange: (e: React.ChangeEvent<any>) => void
}) {
    const materialStatusLabels = {
        [MaterialStatus.completed]: "Completed",
        [MaterialStatus.inProgress]: "In Progress",
        [MaterialStatus.delayed]: "Delayed",
        [MaterialStatus.notStarted]: "Not Started",
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={value === undefined || value === null ? "text-muted-foreground" : ""}
                >
                    {value === undefined || value === null
                        ? "Material Status"
                        : materialStatusLabels[value]}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" sideOffset={-128} alignOffset={64}>
                {Object.values(MaterialStatus).map((status) => (
                    <DropdownMenuItem
                        key={status}
                        onSelect={() =>
                            onChange({
                                target: { name, value: status },
                            } as React.ChangeEvent<any>)
                        }
                    >
                        {materialStatusLabels[status as MaterialStatus]}
                    </DropdownMenuItem>
                ))}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
