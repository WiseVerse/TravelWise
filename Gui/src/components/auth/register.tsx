"use client"

import React from "react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";


const formSchema = z.object({
    name: z.string()
        .min(1, "Name muss vorhanden sein")
        .max(250, "Name darf nicht länger als 250 Zeichen sein")
        .trim(),
    email: z.string().email().trim(),
    password: z.string()
        .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein")
        .max(256, "Das Passwort darf maximal 256 Zeichen lang sein")
        .regex(/[A-Z]/, "Das Passwort muss mindestens einen Großbuchstaben enthalten")
        .regex(/[\W_]/, "Das Passwort muss mindestens ein Sonderzeichen enthalten")
        .trim(),
});

export default function RegisterForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="account@mail.com" {...field} />
                            </FormControl>
                            <FormDescription className="sr-only">
                                Email
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Max Mustermann" {...field} />
                            </FormControl>
                            <FormDescription className="sr-only">
                                Name
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Passwort</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription className="sr-only">
                                Password
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Register
                </Button>
            </form>
        </Form>
    )
}