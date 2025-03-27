import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuItem,
    SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarGroupLabel
} from "@/components/ui/sidebar";
import React from "react";
import {Home, Route, SearchIcon, Settings} from "lucide-react";
import AppSidebarUser from "@/components/app-sidebar-user";
import Link from "next/link";

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
                        {NavItems.map((item) => (
                            <SidebarMenu key={item.name}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        ))}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/app/settings">
                                <Settings />
                                Einstellungen
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}