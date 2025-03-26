import React from "react";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";

export default function Layout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}