"use client"

import {notFound, usePathname} from "next/navigation";
import React, {useEffect, useState} from "react";
import SiteHeader from "@/components/site-header";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ArrowUp, LoaderCircle} from "lucide-react";
import {chat, message} from "@/lib/types";
import {fetchChat, postMessage} from "@/lib/fetch";

const formSchema = z.object({
    input: z.string().min(1).trim()
})

export default function ChatPage() {
    const [messages, setMessages] = React.useState<message[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false); // Zustand, um den Submit-Status zu verfolgen
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            input: "",
        },
    })
    const id = usePathname().split("/").slice(-1)[0]
    const [chat, setChat] = React.useState<chat | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            await fetchChat(id).then(c => {
                setChat(c)
                if (c.messages) setMessages(c.messages)
            })
            
        }
        fetchData().then()
    }, [id])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        const newMessage = {
            id: (messages.length + 1).toString(),
            content: values.input,
            fromUser: true,
            chatId: id
        }
        console.log(newMessage)
        
        
        // Füge die Benutzernachricht sofort hinzu
        setMessages(prevMessages => [
            ...prevMessages,
            newMessage
        ]);
        await postMessage(newMessage);

        setTimeout(() => {
            setIsSubmitting(false);
        }, 1000);

        form.reset();
    }

    return (
        <>
            {chat != null ? (
                <>
                    <SiteHeader title={chat.name}/>
                    <div className="h-full grid grid-rows-[1fr_auto] m-2 gap-2">
                        <div className="flex flex-col-reverse m-2 gap-2">
                            {messages.toReversed().map((message) => message.fromUser ? (
                                <div key={message.id} className="self-end flex flex-col items-end gap-1">
                                    <div className="text-muted-foreground text-sm">Gooner</div>
                                    <div
                                        className="rounded-md p-2 bg-primary text-primary-foreground">{message.content}</div>
                                </div>
                            ) : (
                                <div key={message.id} className="self-start flex flex-col gap-1">
                                    <div className="text-muted-foreground text-sm">Hasan Abi</div>
                                    <div
                                        className="rounded-md p-2 bg-accent text-accent-foreground">{message.content}</div>
                                </div>
                            ))}
                        </div>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="grid grid-cols-[1fr_auto] gap-2"
                                autoComplete="off" // Verhindert das Speichern von Eingabewerten im Browser
                            >
                                <FormField
                                    control={form.control}
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
                                    disabled={isSubmitting}
                                    className="transition-colors duration-200"
                                >
                                    <ArrowUp/>
                                </Button>
                            </form>
                        </Form>
                    </div>
                </>
            ) : (
                <div className="h-full flex justify-center items-center">
                    <LoaderCircle className="animate-spin"/>
                </div>
            )}
        </>
    );
}
