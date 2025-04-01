"use client"

import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {ArrowDown, Bot, Check, ChevronDown, ChevronLeft, SquareMousePointer} from "lucide-react";
import React, {useEffect, useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {chat, message} from "@/lib/types";
import {fetchChat, fetchChats, postMessage} from "@/lib/fetch";
import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";


const selectChatSchema = z.object({
    chatId: z.string().min(1, "Bitte wähle einen Chat aus."),
})

const messageSchema = z.object({
    input: z.string().min(1).trim()
});

export default function ChatSheet() {
    const [selectedChat, setSelectedChat] = useState<chat | undefined>(undefined);
    const [selectedChatMessages, setSelectedChatMessages] = useState<message[]>([]);
    const [comboboxOpen, setComboboxOpen] = useState(false)
    const [chats, setChats] = useState<chat[]>([]);

    useEffect(() => {
        async function fetchData() {
            await fetchChats().then(cs => {
                setChats(cs);
            })
        }

        fetchData().then()
    }, [])

    const selectForm = useForm<z.infer<typeof selectChatSchema>>({
        resolver: zodResolver(selectChatSchema),
        defaultValues: {
            chatId: "",
        },
    });

    const messageForm = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            input: "",
        },
    })

    async function onSelectSubmit(values: z.infer<typeof selectChatSchema>) {
        await fetchChat(values.chatId).then(c => {
            setSelectedChat(c)
            if (c.messages) setSelectedChatMessages(c.messages)
        }).catch(() => {})
        selectForm.reset()
    }

    async function onNewMessage(values: z.infer<typeof messageSchema>) {
        const newMessage = {
            id: (selectedChatMessages.length + 1).toString(),
            content: values.input,
            fromUser: true,
            chatId: selectedChat!.id
        }
        console.log(newMessage)
        // Füge die Benutzernachricht sofort hinzu
        await postMessage(newMessage);
        setSelectedChatMessages(prevMessages => [
            ...prevMessages,
            newMessage
        ]);

        messageForm.reset();
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline"
                        className="fixed bottom-4 right-4 h-12 w-12">
                    <Bot className="text-4xl"/>
                </Button>
            </SheetTrigger>
            <SheetContent>
                {selectedChat === undefined ? (
                    <>
                        <SheetHeader>
                            <SheetTitle>Wähle einen Chat aus</SheetTitle>
                            <SheetDescription>
                                Wähle einen Chat aus der Liste, um deine Unterhaltung fortzusetzen
                            </SheetDescription>
                        </SheetHeader>

                        <Form {...selectForm}>
                            <form onSubmit={selectForm.handleSubmit(onSelectSubmit)}
                                  className="flex flex-col gap-2 m-4 mt-0">
                                <FormField
                                    control={selectForm.control}
                                    name="chatId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Chat</FormLabel>
                                            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant="outline" className="w-full justify-between">
                                                            {field.value
                                                                ? chats.find((chat) => chat.id === field.value)?.name
                                                                : "Wähle einen Chat"}
                                                            <ChevronDown className="ml-2 h-4 w-4 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Suche Chat..."/>
                                                        <CommandEmpty>Kein Chat gefunden</CommandEmpty>
                                                        <CommandGroup>
                                                            {chats.map((chat) => (
                                                                <CommandItem
                                                                    key={chat.id}
                                                                    onSelect={() => {
                                                                        selectForm.setValue("chatId", chat.id);
                                                                        setComboboxOpen(false);
                                                                    }}
                                                                >
                                                                    {chat.name}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            field.value === chat.id ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription className="sr-only">Chat Auswählen</FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="self-end">
                                    <SquareMousePointer/>
                                    Auswählen
                                </Button>
                            </form>
                        </Form>
                    </>
                )

                :

                (
                    <div className="h-full">
                        <Button variant="link" className="mt-2"
                                onClick={() => setSelectedChat(undefined)}>
                            <ChevronLeft/>
                            Zurück
                        </Button>
                        
                        <SheetHeader className="mt-0">
                            <SheetTitle>{selectedChat.name}</SheetTitle>
                            <SheetDescription>
                                Setze deine Unterhaltung fort
                            </SheetDescription>
                        </SheetHeader>
                        
                        <div className="mx-4">
                            <Form {...messageForm}>
                                <form
                                    onSubmit={messageForm.handleSubmit(onNewMessage)}
                                    className="grid grid-cols-[1fr_auto] gap-2"
                                    autoComplete="off" // Verhindert das Speichern von Eingabewerten im Browser
                                >
                                    <FormField
                                        control={messageForm.control}
                                        name="input"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Schreiben sie mit der TravelWise AI"
                                                        {...field}
                                                        autoComplete="off" // Verhindert das automatische Ausfüllen für dieses Input-Feld
                                                    />
                                                </FormControl>
                                                <FormDescription className="sr-only">
                                                    Input
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="transition-colors duration-200"
                                    >
                                        <ArrowDown/>
                                    </Button>
                                </form>
                            </Form>
                            <ScrollArea className="h-172 flex flex-col mt-2">
                                {selectedChatMessages.toReversed().map((message) => message.fromUser ? (
                                    <div key={message.id} className="self-end flex flex-col items-end gap-1 mt-2">
                                        <div className="text-muted-foreground text-sm">Gooner</div>
                                        <div
                                            className="rounded-md p-2 bg-primary text-primary-foreground">{message.content}</div>
                                    </div>
                                ) : (
                                    <div key={message.id} className="self-start flex flex-col gap-1 mt-2">
                                        <div className="text-muted-foreground text-sm">Hasan Abi</div>
                                        <div
                                            className="rounded-md p-2 bg-accent text-accent-foreground">{message.content}</div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}