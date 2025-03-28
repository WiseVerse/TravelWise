"use client"

import { ColumnDef } from "@tanstack/react-table"
import {chat} from "@/lib/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<chat>[] = [
    {
        accessorKey: "id",
        header: () => <div className="">#</div>,
        cell: ({ row }) => {
            return <div className="font-medium">{row.getValue("id")}</div>
        },
    },
    {
        accessorKey: "name",
        header: "Chat Name",
    },
    {
        id: "actions",
        
    }
]
