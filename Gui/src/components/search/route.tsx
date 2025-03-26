"use client"

import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Form, FormControl, FormDescription, FormField, FormLabel, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Route} from "lucide-react";

const formSchema = z.object({
    start: z.string().min(2).max(250),
    end: z.string().min(2).max(250),
})

export default function SearchRoute() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            start: "",
            end: "",
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
                    name="start"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Start</FormLabel>
                            <FormControl>
                                <Input placeholder="Musterstraße 1" {...field} />
                            </FormControl>
                            <FormDescription className="sr-only">
                                Start Address
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="end"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Ziel</FormLabel>
                            <FormControl>
                                <Input placeholder="Musterstraße 1" {...field} />
                            </FormControl>
                            <FormDescription className="sr-only">
                                Ziel Address
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit">
                    <Route />
                    Berechnen
                </Button>
            </form>
        </Form>
    )
}