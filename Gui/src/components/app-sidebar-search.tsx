"use client"

import {chat} from "@/lib/types";
import {SearchIcon} from "lucide-react";
import React from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import SiteSearch from "@/components/site-search";

export default function AppSidebarSearch({chats}: { chats: chat[] }) {
    const [open, setOpen] = React.useState(false);
    
    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <SidebarMenuButton
                                    tooltip="Suche"
                                    variant="outline"
                                    onClick={() => setOpen(true)}
                                >
                                    <SearchIcon/>
                                    <span>Durchsuche Seite...</span>
                                </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p className="text-sm">
                                    Press{"  "}
                                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                        <span className="text-xs">⌘</span>K
                                    </kbd>
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </SidebarMenuItem>
            </SidebarMenu>
            
            <SiteSearch open={open} setOpen={setOpen} chats={chats}/>
        </>
    )
}