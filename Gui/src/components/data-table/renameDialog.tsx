"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {PenLine} from "lucide-react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React from "react";

const formSchema = z.object({
    name: z.string().min(1, "Name muss vorhanden sein").trim(),
})

export default function RenameDialog({ id, name }: { id: string, name: string }) {
    const [open, setOpen] = React.useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    });
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        await fetch(`https://localhost:7111/chats/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                name: values.name
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        window.location.reload()
        setOpen(false);
        form.reset()
    }
    
    return (    
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="outline">
                    <PenLine/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Umbenennen</DialogTitle>
                    <DialogDescription>Geben Sie den neuen Namen für den Chat: {name} ein</DialogDescription>
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
                                        <Input placeholder={name} autoComplete="off" {...field} />
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