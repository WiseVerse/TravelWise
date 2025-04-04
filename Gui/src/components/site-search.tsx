import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import {CirclePlus, Home, MessageCircle, PlusCircle, Route, SearchIcon, Settings} from "lucide-react";
import React from "react";
import {chat} from "@/lib/types";
import {useRouter} from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {postChat} from "@/lib/fetch";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    chats: chat[]
}

const newChatSchema = z.object({
    name: z.string().min(1, "Name muss vorhanden sein").trim()
})

export default function SiteSearch({open, setOpen, chats}: Props) {
    const [newChatOpen, setNewChatOpen] = React.useState(false);
    const router = useRouter();

    const newChatForm = useForm<z.infer<typeof newChatSchema>>({
        resolver: zodResolver(newChatSchema),
        defaultValues: {
            name: "",
        },
    })

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

    async function onNewChatSubmit(values: z.infer<typeof newChatSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        await postChat(values.name)
        newChatForm.reset()
        setNewChatOpen(false)
        window.location.reload()
    }

    return (
        <>
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
                        <CommandItem onSelect={() => {
                            router.push("/app/settings");
                            setOpen(false);
                        }}>
                            <Settings/>
                            Einstellungen
                        </CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Chats">
                        <CommandItem onSelect={() => {
                            setOpen(false);
                            setNewChatOpen(true);
                        }}>
                            <PlusCircle/>
                            Neuer Chat
                        </CommandItem>
                        <CommandItem onSelect={() => {
                            router.push("/app/chats/");
                            setOpen(false);
                        }}>
                            <MessageCircle/>
                            Alle Chats
                        </CommandItem>
                        {chats.toReversed().map((chat) => (
                            <CommandItem key={chat.id} onSelect={() => {
                                router.push("/app/chats/" + chat.id);
                                setOpen(false);
                            }} className="flex justify-between items-center">
                            <span>
                                {chat.name}
                            </span>
                                <span className="text-muted-foreground">
                                {
                                    (() => {
                                        const createdDate = new Date(chat.created);
                                        const now = new Date();
                                        const isToday =
                                            createdDate.getDate() === now.getDate() &&
                                            createdDate.getMonth() === now.getMonth() &&
                                            createdDate.getFullYear() === now.getFullYear();

                                        return isToday
                                            ? createdDate.toTimeString().split(" ")[0] // Uhrzeit, z.B. "14:30:45"
                                            : createdDate.toISOString().split("T")[0];  // Datum, z.B. "2025-04-04"
                                    })()
                                }
                            </span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>

            <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
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
        </>
    )
}