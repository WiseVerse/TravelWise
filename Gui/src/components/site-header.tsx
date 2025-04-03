"use client"

import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import React, {useEffect} from "react";
import {
    Breadcrumb,
    BreadcrumbItem, BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {useIsMobile} from "@/hooks/use-mobile";
import {Button} from "@/components/ui/button";
import SiteSearch from "@/components/site-search";
import {Menu} from "lucide-react";
import {chat} from "@/lib/types";
import {fetchChats} from "@/lib/fetch";

export default function SiteHeader({title, variant="default"}: { title: string, variant?: "default" | "chats" }) {
    const isMobile = useIsMobile()
    const [open, setOpen] = React.useState(false);
    const [chats, setChats] = React.useState<chat[]>([]);
    useEffect(() => {
        setOpen(false);
    }, [isMobile]);
    
    useEffect(() => {
        const fetchData = async () => {
            await fetchChats().then(data => setChats(data));
        }
        
        fetchData().then()
    }, [])
    
    switch (variant) {
        case "default":
            return (
                <header
                    className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
                    <div className="flex w-full items-center gap-1 px-4">
                        {isMobile ? (
                            <>
                                <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
                                    <Menu/>
                                </Button>
                                <SiteSearch open={open} setOpen={setOpen} chats={chats}/>
                            </>
                        ) : (
                            <SidebarTrigger className="-ml-1"/>
                        )}
                        <Separator
                            orientation="vertical"
                            className="mx-2 data-[orientation=vertical]:h-4"
                        />
                        <h1 className="text-base font-medium">{title}</h1>
                    </div>
                </header>
            )
        case "chats":
            return (
                <header
                    className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
                    <div className="flex w-full items-center gap-1 px-4">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator
                            orientation="vertical"
                            className="mx-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/app/chats" className="text-base font-medium">Chats</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-base">{title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
            )
    }
}