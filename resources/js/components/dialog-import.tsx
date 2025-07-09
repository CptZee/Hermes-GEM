import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadIcon } from "lucide-react";
import { useForm, router } from "@inertiajs/react";

export function ImportPostsDialog() {
    const [open, setOpen] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);

    const { processing } = useForm();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploaded = e.target.files?.[0];
        if (uploaded) setFile(uploaded);
    };


    const handleUpload = () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        router.post("/posts/import", formData, {
            onSuccess: () => {
                setOpen(false);
                setFile(null);
            },
        });
    };

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>
                <UploadIcon className="mr-2 size-4" />
                Import
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Posts</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-2">
                        <Input type="file" accept=".xlsx" onChange={handleFileChange} />
                        {file && (
                            <p className="text-sm text-muted-foreground">Selected: {file.name}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpload} disabled={!file || processing}>
                            Upload
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
