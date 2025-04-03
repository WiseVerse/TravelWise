"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormLabel, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {useEffect} from "react";

const formSchema = z.object({
    search: z.string()
        .min(1, "Adresse muss vorhanden sein")
        .trim(),
});

// Hier definieren wir die Props, die auch einen onSearch Callback beinhalten
interface SearchAddressProps {
    onSearchAction: (address: string) => void;
    value?: string;
}

export default function SearchAddress({ onSearchAction, value }: SearchAddressProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: "",
        },
    });

    useEffect(() => {
        if (value) {
            form.setValue("search", value);
        }
    }, [value, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Statt nur console.log, rufen wir den Callback auf
        onSearchAction(values.search);
        console.log("Form submitted", values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adresse</FormLabel>
                            <FormControl>
                                <Input placeholder="Musterstraße 1" autoComplete="off" {...field} />
                            </FormControl>
                            <FormDescription className="sr-only">
                                Address
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">
                    <Search />
                    Suchen
                </Button>
            </form>
        </Form>
    )
}
