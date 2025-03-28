"use client"

import {chat} from "@/lib/types";
import {SearchIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import React from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import {useRouter} from "next/navigation";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

export default function AppSidebarSearch({chats}: { chats: chat[] }) {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])
    
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
                            onClick={() => setOpen(true)}
                        >
                            <SearchIcon/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-sm">
                            Press{"  "}
                            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
           
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Suche nach Chats..."/>
                <CommandList>
                    <CommandEmpty>Keine Chats gefunden</CommandEmpty>
                    <CommandGroup heading="Chats">
                        {chats.toReversed().map((chat) => (
                            <CommandItem key={chat.id} onSelect={() => {
                                router.push("/app/chats/" + chat.id);
                                setOpen(false);
                            }}>
                                {chat.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}