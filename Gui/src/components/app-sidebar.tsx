"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuItem,
    SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarGroupLabel
} from "@/components/ui/sidebar";
import React, {useEffect, useRef, useState} from "react";
import {Home, PenLine, PlusCircle, Route, Search, SearchIcon, Settings, Trash2} from "lucide-react";
import AppSidebarUser from "@/components/app-sidebar-user";
import Link from "next/link";
import AppSidebarSearch from "@/components/app-sidebar-search";
import {fetchChats, postChat} from "@/lib/fetch";
import {chat} from "@/lib/types";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem, ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger
} from "@/components/ui/context-menu";

const NavItems = [
    {
        icon: <Home/>,
        name: "Home",
        url: "/app"
    },
    {
        icon: <SearchIcon/>,
        name: "Suche",
        url: "/app/search"
    },
    {
        icon: <Route/>,
        name: "Route",
        url: "/app/route"
    },
]

const newChatSchema = z.object({
    name: z.string().min(1, "Gib dem Chat einen Namen").trim()
})

export default function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const [chats, setChats] = useState<chat[]>([])
    const [newChatOpen, setNewChatOpen] = useState(false)
    const form = useForm<z.infer<typeof newChatSchema>>({
        resolver: zodResolver(newChatSchema),
        defaultValues: {
            name: "",
        },
    })

    async function onSubmit(values: z.infer<typeof newChatSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        await postChat(values.name)
        setChats(prevState => [...prevState, {
            id: (prevState.length + 1).toString(),
            name: values.name,
            messages: undefined,
        }])
        setNewChatOpen(false)
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchChats().then(c => setChats(c))
        }

        fetchData().then()
    }, [])

    function onRename(chat: chat) {
        console.log("Penis Rename", chat.name)
    }

    function onDelete(chat: chat) {
        console.log("Penis Delete", chat.name)
    }

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <AppSidebarUser/>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {NavItems.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Chats</SidebarGroupLabel>
                    <SidebarGroupContent className="flex flex-col gap-2">

                        <SidebarMenu>
                            <SidebarMenuItem className="flex items-center gap-2">
                                <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
                                    <DialogTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip="Neuer Chat"
                                            className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                                        >
                                            <PlusCircle/>
                                            <span>Neuer Chat</span>
                                        </SidebarMenuButton>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Neuer Chat</DialogTitle>
                                            <DialogDescription>Erstelle einen neuen Chat</DialogDescription>
                                        </DialogHeader>
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)}
                                                  className="flex flex-col gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Was braucht denn ein guter Goon?"
                                                                       autoComplete="off" {...field} />
                                                            </FormControl>
                                                            <FormDescription className="sr-only">
                                                                Address
                                                            </FormDescription>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" className="self-end">
                                                    <Search/>
                                                    Suchen
                                                </Button>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                                <AppSidebarSearch chats={chats}/>
                            </SidebarMenuItem>
                        </SidebarMenu>


                        <SidebarMenu>
                            {chats.toReversed().map((chat) => (
                                <SidebarMenuItem key={chat.id}>
                                    <ContextMenu>
                                        <ContextMenuTrigger asChild>
                                            <SidebarMenuButton asChild>
                                                <Link href={`/app/chats/${chat.id}`}>{chat.name}</Link>
                                            </SidebarMenuButton>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent className="w-48">
                                            <ContextMenuItem onSelect={() => onRename(chat)}>
                                                <PenLine/>
                                                Rename
                                                <ContextMenuShortcut>F2</ContextMenuShortcut>
                                            </ContextMenuItem>
                                            <ContextMenuSeparator/>
                                            <ContextMenuItem variant="destructive" onSelect={() => onDelete(chat)}>
                                                <Trash2/>
                                                Delete
                                                <ContextMenuShortcut>Del</ContextMenuShortcut>
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/app/settings">
                                <Settings/>
                                Einstellungen
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}