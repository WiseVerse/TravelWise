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
})

interface SearchRouteProps {
    startValue?: string;
    onRouteSubmit?: (data: { start: string; end: string }) => void;
    onRouteClear?: () => void;
}

export default function SearchRoute({ onRouteSubmit, onRouteClear }: SearchRouteProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            start: "",
            end: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        if (onRouteSubmit) {
            onRouteSubmit(values);
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