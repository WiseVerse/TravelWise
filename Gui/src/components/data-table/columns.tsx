"use client"

import {ColumnDef} from "@tanstack/react-table"
import {chat} from "@/lib/types";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import Link from "next/link";
import RenameDialog from "@/components/data-table/renameDialog";
import DeleteDialog from "@/components/data-table/deleteDialog";

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
        header: () => {
            return (
                <div>Chat Name</div>
            )
        },
        cell: ({row}) => (
            <Link href={`/app/chats/${row.getValue("id")}`}>
                {row.getValue("name")}
            </Link>
        )
    },
    {
        accessorKey: "created",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Datum
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => {
            const value: string = row.getValue("created")
            const split = value.split(":")
            const formated = split[0].split("T")[0] + " " + `${split[0].split("T")[1]}:${split[1]}:${split[2].split(".")[0]}`
            return (
                <div>{formated}</div>

            )
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({row}) => {
            return (
                <div className="flex justify-end gap-2">
                    <RenameDialog id={row.getValue("id")} name={row.getValue("name")}/>
                    <DeleteDialog id={row.getValue("id")} name={row.getValue("name")}/>
                </div>
            )
        }
    },
]
