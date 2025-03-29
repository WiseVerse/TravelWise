"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton
} from "@/components/ui/sidebar";
import React, {useEffect, useState} from "react";
import {CirclePlus, Home, MessageCircle, PenLine, PlusCircle, Route, SearchIcon, Settings, Trash2} from "lucide-react";
import AppSidebarUser from "@/components/app-sidebar-user";
import Link from "next/link";
import AppSidebarSearch from "@/components/app-sidebar-search";
import {deleteChatFetch, fetchChats, postChat, renameChatFetch} from "@/lib/fetch";
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
    ContextMenuTrigger
} from "@/components/ui/context-menu";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {usePathname, useRouter} from "next/navigation";

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
    name: z.string().min(1, "Name muss vorhanden sein").trim()
})

export default function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const [chats, setChats] = useState<chat[]>([])
    const [newChatOpen, setNewChatOpen] = useState(false)
    const [renameChatOpen, setRenameChatOpen] = useState(false)
    const [deleteChatOpen, setDeleteChatOpen] = useState(false)
    const [selectedChat, setSelectedChat] = useState<chat | null>(null)
    const newChatForm = useForm<z.infer<typeof newChatSchema>>({
        resolver: zodResolver(newChatSchema),
        defaultValues: {
            name: "",
        },
    })
    const renameForm = useForm<z.infer<typeof newChatSchema>>({
        resolver: zodResolver(newChatSchema),
        defaultValues: {
            name: "",
        },
    })
    const router = useRouter()
    const pathname = usePathname()

    async function onNewChatSubmit(values: z.infer<typeof newChatSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        await postChat(values.name)
        setChats(await fetchChats())
        newChatForm.reset()
        setNewChatOpen(false)
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchChats().then(c => setChats(c))
        }

        fetchData().then()
    }, [])

    function onRename(chat: chat) {
        setRenameChatOpen(true)
        setSelectedChat(chat)
    }

    function onDelete(chat: chat) {
        setDeleteChatOpen(true)
        setSelectedChat(chat)
    }
    
    async function renameChat(values: z.infer<typeof newChatSchema>) {
        if (!selectedChat) return    
        await renameChatFetch(selectedChat?.id, values.name)
        setChats(await fetchChats())
        renameForm.reset()
        setRenameChatOpen(false)
    }
    
    async function deleteChat() {
        if (!selectedChat) return 
        await deleteChatFetch(selectedChat?.id.toString())
        setChats(await fetchChats())
        if (pathname.includes(selectedChat.id)) {
            router.push("/app")
        } 
        if (pathname.endsWith("chats")) {
            window.location.reload()
            //TODO: Seite refreshed nd wenn er auf Alle Chats Seite ist
        }
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
                                        <Form {...newChatForm}>
                                            <form onSubmit={newChatForm.handleSubmit(onNewChatSubmit)}
                                                  className="flex flex-col gap-4">
                                                <FormField
                                                    control={newChatForm.control}
                                                    name="name"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Was braucht denn ein guter Goon?"
                                                                       autoComplete="off" {...field} />
                                                            </FormControl>
                                                            <FormDescription className="sr-only">
                                                                Name
                                                            </FormDescription>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" className="self-end">
                                                    <CirclePlus/>
                                                    Submit
                                                </Button>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                                <AppSidebarSearch chats={chats}/>
                            </SidebarMenuItem>
                        </SidebarMenu>


                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/app/chats">
                                        <MessageCircle/>
                                        Alle Chats
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuSub>
                                    {chats.toReversed().map((chat) => (
                                        <SidebarMenuSubItem key={chat.id}>
                                            <ContextMenu>
                                                <ContextMenuTrigger asChild>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link href={`/app/chats/${chat.id}`}>{chat.name}</Link>
                                                    </SidebarMenuSubButton>
                                                </ContextMenuTrigger>
                                                <ContextMenuContent className="w-48">
                                                    <ContextMenuItem onSelect={() => onRename(chat)}>
                                                        <PenLine/>
                                                        Rename
                                                    </ContextMenuItem>
                                                    <ContextMenuSeparator/>
                                                    <ContextMenuItem variant="destructive" onSelect={() => onDelete(chat)}>
                                                        <Trash2/>
                                                        Delete
                                                    </ContextMenuItem>
                                                </ContextMenuContent>
                                            </ContextMenu>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </SidebarMenuItem>
                            <Dialog open={renameChatOpen} onOpenChange={setRenameChatOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Chat umbenennen</DialogTitle>
                                        <DialogDescription>Ausgewählter Chat: {selectedChat?.name}</DialogDescription>
                                    </DialogHeader>
                                    <Form {...renameForm}>
                                        <form onSubmit={renameForm.handleSubmit(renameChat)}
                                              className="flex flex-col gap-4">
                                            <FormField
                                                control={renameForm.control}
                                                name="name"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder={selectedChat?.name}
                                                                   autoComplete="off" {...field} />
                                                        </FormControl>
                                                        <FormDescription className="sr-only">
                                                            Name
                                                        </FormDescription>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="self-end">
                                                Submit
                                            </Button>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                            <AlertDialog open={deleteChatOpen} onOpenChange={setDeleteChatOpen}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Diese Aktion kann nicht rückgängig gemacht werden und wird diesen Chat für
                                            immer von unseren Servern löschen.
                                            <br/>
                                            Ausgewählter Chat: {selectedChat?.name}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Abbruch</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteChat()}>
                                            Ok
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
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