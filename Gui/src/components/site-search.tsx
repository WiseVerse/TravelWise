"use client"

import React from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    CirclePlus,
    Home,
    MessageCircle,
    PlusCircle,
    Route,
    SearchIcon,
    Settings,
    Sparkles,
    Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { postChat } from "@/lib/fetch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {chat} from "@/lib/types";

// Schema und Formular für den Neuen Chat
const newChatSchema = z.object({
    name: z.string().min(1, "Name muss vorhanden sein").trim(),
});

// Schema und Formular für Feedback
const feedbackSchema = z.object({
    content: z.string().min(1, "Bitte gib dein Feedback ein").trim(),
    rating: z.number().min(0).max(5),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface Props {
    open: boolean;
    setOpen?: (open: boolean) => void;
    chats: chat[];
}

export default function SiteSearch({ open, setOpen, chats }: Props) {
    const router = useRouter();
    const [newChatOpen, setNewChatOpen] = React.useState(false);
    const [feedbackOpen, setFeedbackOpen] = React.useState(false);

    // Formular für Neuen Chat
    const newChatForm = useForm<z.infer<typeof newChatSchema>>({
        resolver: zodResolver(newChatSchema),
        defaultValues: { name: "" },
    });

    // Formular für Feedback
    const feedbackForm = useForm<FeedbackFormData>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: { content: "", rating: 0 },
    });
    const [rating, setRating] = React.useState(0);

    const handleStarClick = (selectedStar: number) => {
        if (rating === selectedStar) {
            setRating(0);
            feedbackForm.setValue("rating", 0);
        } else {
            setRating(selectedStar);
            feedbackForm.setValue("rating", selectedStar);
        }
    };

    const onFeedbackSubmit = (values: FeedbackFormData) => {
        console.log("Feedback submitted:", values);
        feedbackForm.reset();
        setRating(0);
        setFeedbackOpen(false);
    };

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (setOpen) {
                    setOpen(!open);
                }
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [open, setOpen]);

    async function onNewChatSubmit(values: z.infer<typeof newChatSchema>) {
        await postChat(values.name);
        newChatForm.reset();
        setNewChatOpen(false);
        window.location.reload();
    }

    return (
        <>
            {/* Command Dialog */}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Suche nach Chats..." />
                <CommandList>
                    <CommandEmpty>Nichts dazu gefunden</CommandEmpty>

                    <CommandGroup heading="Schnellzugriff">
                        <CommandItem onSelect={() => { router.push("/app");
                            if (setOpen) {
                                setOpen(false);
                            } }}>
                            <Home />
                            Home
                        </CommandItem>
                        <CommandItem onSelect={() => { router.push("/app/settings");
                            if (setOpen) {
                                setOpen(false);
                            } }}>
                            <Settings />
                            Einstellungen
                        </CommandItem>
                        <CommandItem onSelect={() => {
                            if (setOpen) {
                                setOpen(false);
                            } setFeedbackOpen(true); }}>
                            <Sparkles />
                            Feedback geben
                        </CommandItem>
                    </CommandGroup>

                    <CommandGroup heading="Navigation">
                        <CommandItem onSelect={() => { router.push("/app/search");
                            if (setOpen) {
                                setOpen(false);
                            } }}>
                            <SearchIcon />
                            Suche
                        </CommandItem>
                        <CommandItem onSelect={() => { router.push("/app/route");
                            if (setOpen) {
                                setOpen(false);
                            } }}>
                            <Route />
                            Route
                        </CommandItem>
                    </CommandGroup>

                    <CommandGroup heading="Chats">
                        <CommandItem onSelect={() => {
                            if (setOpen) {
                                setOpen(false);
                            } setNewChatOpen(true); }}>
                            <PlusCircle />
                            Neuer Chat
                        </CommandItem>
                        <CommandItem onSelect={() => { router.push("/app/chats/");
                            if (setOpen) {
                                setOpen(false);
                            } }}>
                            <MessageCircle />
                            Alle Chats
                        </CommandItem>
                        {chats.toReversed().map((chat) => (
                            <CommandItem
                                key={chat.id}
                                onSelect={() => { router.push("/app/chats/" + chat.id);
                                    if (setOpen) {
                                        setOpen(false);
                                    } }}
                                className="flex justify-between items-center"
                            >
                                <span>{chat.name}</span>
                                <span className="text-muted-foreground">
                  {(() => {
                      const createdDate = new Date(chat.created);
                      const now = new Date();
                      const isToday =
                          createdDate.getDate() === now.getDate() &&
                          createdDate.getMonth() === now.getMonth() &&
                          createdDate.getFullYear() === now.getFullYear();
                      return isToday
                          ? createdDate.toTimeString().split(" ")[0]
                          : createdDate.toISOString().split("T")[0];
                  })()}
                </span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>

            {/* Dialog für Neuen Chat */}
            <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Neuer Chat</DialogTitle>
                        <DialogDescription>Erstelle einen neuen Chat</DialogDescription>
                    </DialogHeader>
                    <Form {...newChatForm}>
                        <form onSubmit={newChatForm.handleSubmit(onNewChatSubmit)} className="flex flex-col gap-4">
                            <FormField
                                control={newChatForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Was braucht denn ein guter Goon?" autoComplete="off" {...field} />
                                        </FormControl>
                                        <FormDescription className="sr-only">Name</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="self-end">
                                <CirclePlus />
                                Submit
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Dialog für Feedback mit vollem Formular */}
            <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Feedback</DialogTitle>
                        <DialogDescription>
                            Bitte gib dein Feedback ein. Füge Schlagwörter hinzu und wähle eine Bewertung.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...feedbackForm}>
                        <form onSubmit={feedbackForm.handleSubmit(onFeedbackSubmit)} className="flex flex-col gap-4">
                            <FormField
                                control={feedbackForm.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Feedback</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Dein Feedback..." {...field} />
                                        </FormControl>
                                        <FormDescription className="sr-only">Feedback-Inhalt</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col">
                                <span className="mb-1">Bewertung</span>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleStarClick(star)}
                                            className="focus:outline-none"
                                        >
                                            <Star className={rating >= star ? "text-yellow-500" : "text-gray-400"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Button type="submit" className="self-end">
                                Absenden
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}