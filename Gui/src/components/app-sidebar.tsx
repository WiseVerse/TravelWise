import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuItem,
    SidebarRail,
    SidebarMenuButton, SidebarGroup, SidebarGroupContent
} from "@/components/ui/sidebar";
import React from "react";
import {Route, SearchIcon} from "lucide-react";
import AppSidebarUser from "@/components/app-sidebar-user";

const NavItems = [
    {
        icon: <SearchIcon/>,
        name: "Suche",
        url: ""
    },
    {
        icon: <Route/>,
        name: "Route berechnen",
        url: "app/route"
    },
]

export default function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <AppSidebarUser/>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
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
                {/*<SidebarMenu>*/}
                {/*    <SidebarMenuItem>*/}
                {/*        <SidebarMenuButton>*/}
                {/*            <Settings />*/}
                {/*            Settings*/}
                {/*        </SidebarMenuButton>*/}
                {/*    </SidebarMenuItem>*/}
                {/*</SidebarMenu>*/}
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}