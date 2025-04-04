import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import {Home, Route, SearchIcon} from "lucide-react";
import React from "react";
import {chat} from "@/lib/types";
import {useRouter} from "next/navigation";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    chats: chat[]
}

export default function SiteSearch({open, setOpen, chats}: Props) {
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen(!open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    })
    
    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Suche nach Chats..."/>
            <CommandList>
                <CommandEmpty>Nichts dazu gefunden</CommandEmpty>
                <CommandGroup heading="Navigation">
                    <CommandItem onSelect={() => {
                        router.push("/app");
                        setOpen(false);
                    }}>
                        <Home/>
                        Home
                    </CommandItem>
                    <CommandItem onSelect={() => {
                        router.push("/app/search");
                        setOpen(false);
                    }}>
                        <SearchIcon/>
                        Suche
                    </CommandItem>
                    <CommandItem onSelect={() => {
                        router.push("/app/route");
                        setOpen(false);
                    }}>
                        <Route/>
                        Route
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Chats">
                    {chats.toReversed().map((chat) => (
                        <CommandItem key={chat.id} onSelect={() => {
                            router.push("/app/chats/" + chat.id);
                            setOpen(false);
                        }} className="flex justify-between items-center">
                                <span>
                                    {chat.name}
                                </span>
                            <span className="text-muted-foreground">
                                    {chat.created.split("T")[0] + " " + chat.created.split("T")[1].split(".")[0]}
                                </span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}