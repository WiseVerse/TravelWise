"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    VisibilityState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NewChatDialog from "@/components/data-table/newChatDialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input"
import {ArrowLeft, ArrowRight, ChevronDown, Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {deleteChatFetch} from "@/lib/fetch";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                         }: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [deleteSelectedOpen, setDeleteSelectedOpen] = React.useState<boolean>(false)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })


    async function deleteSelectedChats() {
        if (table.getFilteredSelectedRowModel().rows.length === 0) return 
        for (const row of table.getFilteredSelectedRowModel().rows) {
            await deleteChatFetch(row.getValue("id"))
        }
        window.location.reload()
    }

    return (
        <div>
            <div className="flex items-center pb-2">
                <Input
                    placeholder="Filter chats..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Spalten <ChevronDown/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) => column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-2">
                <div className="flex justify-center items-center text-sm text-muted-foreground gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="hover:bg-destructive/10"
                                    onClick={() => setDeleteSelectedOpen(true)}>
                                <Trash2 className="text-destructive"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            Ausgewählte Reihen löschen
                        </TooltipContent>
                    </Tooltip>
                    <AlertDialog open={deleteSelectedOpen} onOpenChange={setDeleteSelectedOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                <AlertDialogDescription>Diese Aktion kann nicht rückgängig gemacht werden und wird
                                    alle ausgewählten Chats für immer von unseren Servern löschen.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Abbruch</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteSelectedChats()}>
                                    Ok
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <span>
                        {table.getFilteredSelectedRowModel().rows.length} von{" "}
                        {table.getFilteredRowModel().rows.length} Reihen ausgewählt.
                    </span>
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ArrowLeft/>
                    </Button>
                    <NewChatDialog/>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ArrowRight/>
                    </Button>
                </div>
            </div>
        </div>
    )
}
