import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

<Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">
                    Close
                </Button>
            </DialogClose>
        </DialogFooter>
    </DialogContent>
</Dialog>