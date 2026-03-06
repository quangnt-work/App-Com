// src/components/admin/lessons/videos/DeleteVideoButton.tsx
"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteGrammar } from "@/actions/GrammarActions";
import { toast } from "sonner";
import { useTransition, useState } from "react";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface DeleteVideoButtonProps {
    id: string;
    title: string;
}

export default function DeleteVideoButton({ id, title }: DeleteVideoButtonProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const res = await deleteGrammar(id);
            if (res.success) {
                toast.success(res.message);
                setOpen(false);
            } else {
                toast.error(res.message);
            }
        });
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                onClick={() => setOpen(true)}
                disabled={isPending}
            >
                <Trash2 className="w-4 h-4" />
            </Button>

            <ConfirmModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={handleDelete}
                loading={isPending}
                title="Xóa video?"
                description={`Bạn có chắc muốn xóa video "${title}"? Hành động này không thể hoàn tác.`}
            />
        </>
    );
}
