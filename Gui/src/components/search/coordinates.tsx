"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const coordinateRegex = /^(\d{1,2}\.\d{5,})°[NS] (\d{1,3}\.\d{5,})°[EW]$/;

const formSchema = z.object({
    coordinates: z
        .string()
        .regex(
            coordinateRegex,
            "Ungültiges Koordinatenformat. Mindestens 5 Dezimalstellen. Beispiel: 48.40999°N 15.60384°E"
        )
        .trim(),
});

interface SearchCoordinatesProps {
    value?: string;
}

export default function SearchCoordinates({ value }: SearchCoordinatesProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            coordinates: value || "",
        },
    });

    // Wenn der prop "value" sich ändert, wird der Wert im Formular aktualisiert.
    useEffect(() => {
        if (value) {
            form.setValue("coordinates", value);
        }
    }, [value, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="coordinates"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Koordinaten</FormLabel>
                            <FormControl>
                                <Input placeholder="48.40999°N 15.60384°E" autoComplete="off" {...field} />
                            </FormControl>
                            <FormDescription className="sr-only">Coordinates</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit">
                    <Search />
                    Suchen
                </Button>
            </form>
        </Form>
    );
}
