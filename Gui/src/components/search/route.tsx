"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormLabel, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Route, Trash2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const allowedModes = ["DRIVING", "WALKING", "BICYCLING", "TRANSIT"] as const;

const formSchema = z.object({
    start: z.string()
        .min(1, "Start Adresse muss vorhanden sein")
        .trim(),
    stops: z.string().optional(),
    end: z.string()
        .min(1, "Ziel Adresse muss vorhanden sein")
        .trim(),
    mode: z.string()
        .nonempty("Bitte wähle einen Modus aus")
        .refine(value => allowedModes.includes(value as typeof allowedModes[number]), {
            message: "Ungültiger Modus",
        }),
}).refine(data => {
    if (data.mode === "TRANSIT") {
        return !data.stops || data.stops.trim() === "";
    }
    return true;
}, {
    path: ["stops"],
    message: "Zwischenstopps dürfen nicht angegeben sein, wenn ÖPNV gewählt ist",
});

type FormValues = z.infer<typeof formSchema>;

interface SearchRouteProps {
    onRouteSubmit?: (data: { start: string; stops?: string; end: string; mode: google.maps.TravelMode }) => void;
    onRouteClear?: () => void;
}

export default function SearchRoute({ onRouteSubmit, onRouteClear }: SearchRouteProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            start: "",
            stops: "",
            end: "",
            mode: "",
        },
    });

    function onSubmit(values: FormValues) {
        if (onRouteSubmit) {
            // Cast, damit TypeScript weiß, dass values.mode ein gültiger Schlüssel ist.
            const travelMode = window.google.maps.TravelMode[values.mode as keyof typeof window.google.maps.TravelMode];
            onRouteSubmit({
                start: values.start,
                stops: values.stops,
                end: values.end,
                mode: travelMode,
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="start"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start</FormLabel>
                            <FormControl>
                                <Input placeholder="Musterstraße 1" {...field} autoComplete="off"/>
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
                    name="stops"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Zwischenstopps</FormLabel>
                            <FormControl>
                                <Input placeholder="Adresse 1, Adresse 2, …" {...field} autoComplete="off"/>
                            </FormControl>
                            <FormDescription>
                                Optional: Mehrere Stopps durch Kommas trennen
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="end"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ziel</FormLabel>
                            <FormControl>
                                <Input placeholder="Musterstraße 1" {...field} autoComplete="off"/>
                            </FormControl>
                            <FormDescription className="sr-only">
                                Ziel Address
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Modus</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Wähle einen Modus" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DRIVING">Auto</SelectItem>
                                        <SelectItem value="WALKING">Zu Fuß</SelectItem>
                                        <SelectItem value="BICYCLING">Fahrrad</SelectItem>
                                        <SelectItem value="TRANSIT">ÖPNV</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>Wähle einen Fortbewegungsmodus</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-2">
                    <Button type="submit">
                        <Route />
                        Berechnen
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => {
                        if (onRouteClear) onRouteClear();
                        form.reset();
                    }}>
                        <Trash2 />
                        Route löschen
                    </Button>
                </div>
            </form>
        </Form>
    );
}