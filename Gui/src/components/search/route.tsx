"use client"

import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Form, FormControl, FormDescription, FormField, FormLabel, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Route, Trash2} from "lucide-react";

const formSchema = z.object({
    start: z.string()
        .min(1, "Start Adresse muss vorhanden sein")
        .trim(),
    end: z.string()
        .min(1, "Ziel Adresse muss vorhanden sein")
        .trim(),
    mode: z.enum(["DRIVING", "WALKING", "BICYCLING", "TRANSIT"] as const, {
        errorMap: () => ({ message: "Bitte wähle einen Modus aus" }),
    }),
/*    stop: z.string()
        .min(1, "Zwischenstopp Adresse mus vorhanden sein")
        .trim(),*/
})

type FormValues = z.infer<typeof formSchema>;

interface SearchRouteProps {
    startValue?: string;
    onRouteSubmit?: (data: { start: string; end: string; mode: google.maps.TravelMode}) => void;
    onRouteClear?: () => void;
}

export default function SearchRoute({ onRouteSubmit, onRouteClear }: SearchRouteProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            start: "",
            end: "",
            mode: "DRIVING",
            //stop: "",
        },
    });

    function onSubmit(values: FormValues) {
        if (onRouteSubmit) {
            // Google Maps expects TravelMode enum
            onRouteSubmit({
                start: values.start,
                end: values.end,
                mode: window.google.maps.TravelMode[values.mode],
            });
        }
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
                    name="end"
                    render={({field}) => (
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
                                <select {...field} className="w-full border rounded p-2">
                                    <option value="DRIVING">Auto</option>
                                    <option value="WALKING">Zu Fuß</option>
                                    <option value="BICYCLING">Fahrrad</option>
                                    <option value="TRANSIT">ÖPNV</option>
                                </select>
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
                        if (onRouteClear) onRouteClear()
                        form.reset()
                    }}>
                        <Trash2 />
                        Route löschen
                    </Button>
                </div>
            </form>
        </Form>
    )
}