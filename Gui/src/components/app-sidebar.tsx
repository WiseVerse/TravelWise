import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuItem,
    SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarGroupLabel
} from "@/components/ui/sidebar";
import React from "react";
import {Home, LoaderCircle, PlusCircle, Route, SearchIcon, Settings} from "lucide-react";
import AppSidebarUser from "@/components/app-sidebar-user";
import Link from "next/link";
import AppSidebarSearch from "@/components/app-sidebar-search";

export type chat = {
    id: number;
    name: string;
    url: string;
}

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

export const chats: chat[] = [
    {
        id: 1,
        name: "Wie Goone ich richtig?",
        url: "/app/chats/1"
    },
    {
        id: 2,
        name: "Was ist ein Glory Hole?",
        url: "/app/chats/2"
    }
]

export default function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
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
                                <SidebarMenuButton
                                    tooltip="Neuer Chat"
                                    className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                                >
                                    <PlusCircle/>
                                    <span>Neuer Chat</span>
                                </SidebarMenuButton>
                                <AppSidebarSearch chats={chats}/>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        <SidebarMenu>
                            {chats.toReversed().map((chat) => (
                                <SidebarMenuItem key={chat.id}>
                                    <SidebarMenuButton asChild>
                                        <Link href={chat.url}>{chat.name}</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                        <SidebarMenu className="mt-1">
                            <SidebarMenuItem className="flex justify-center">
                                <LoaderCircle className="animate-spin h-4 w-4"/>
                            </SidebarMenuItem>
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