"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {CirclePlus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import React from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {postChat} from "@/lib/fetch";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

const formSchema = z.object({
    name: z.string().min(1, "Name muss vorhanden sein").trim(),
})

export default function NewChatDialog() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await postChat(values.name)
            .then(() => window.location.reload())
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="icon" variant="outline">
                    <CirclePlus/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Neuer Chat</DialogTitle>
                    <DialogDescription>Erstelle einen neuen Chat</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Was bedeuted es zu goonen?" autoComplete="off" {...field} />
                                    </FormControl>
                                    <FormDescription className="sr-only">
                                        Name
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="self-end">
                            Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}