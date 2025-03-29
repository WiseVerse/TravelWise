"use client"

import {ColumnDef} from "@tanstack/react-table"
import {chat} from "@/lib/types";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import RenameDialog from "@/components/data-table/renameDialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<chat>[] = [
    {
        accessorKey: "id",
        header: () => <div className="">#</div>,
        cell: ({row}) => {
            return <div className="font-medium">{row.getValue("id")}</div>
        },
    },
    {
        accessorKey: "name",
        header: "Chat Name",
        cell: ({row}) => (
            <Link href={`/app/chats/${row.getValue("id")}`}>
                {row.getValue("name")}
            </Link>
        )
    },
    {
        id: "actions",
        cell: ({row}) => {
            return (
                <div className="flex justify-end gap-2">
                    <RenameDialog id={row.getValue("id")} name={row.getValue("name")}/>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="icon" variant="outline" className="hover:bg-destructive/10">
                                <Trash2 className="text-destructive"/>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            Benis
                        </DialogContent>
                    </Dialog>
                </div>
            )
        }
    },
]
