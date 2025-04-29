"use client"

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Sparkles, Star} from "lucide-react";
import {SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";

const feedbackSchema = z.object({
    content: z.string().min(1, "Bitte gib dein Feedback ein").trim(),
    rating: z.number().min(0).max(5),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export default function FeedbackDialog() {
    const form = useForm<FeedbackFormData>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: { content: "", rating: 0 },
    });
    const [rating, setRating] = useState(0);
    const [open, setOpen] = useState(false);

    const handleStarClick = (selectedStar: number) => {
        if (rating === selectedStar) {
            setRating(0);
            form.setValue("rating", 0);
        } else {
            setRating(selectedStar);
            form.setValue("rating", selectedStar);
        }
    };

    const onSubmit = (values: FeedbackFormData) => {
        console.log("Feedback submitted:", values);
        form.reset();
        setRating(0);
        // Dialog schließen
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <SidebarMenuItem>
                    <SidebarMenuButton>
                        <Sparkles/>
                        Feedback geben
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Feedback</DialogTitle>
                    <DialogDescription>
                        Bitte gib dein Feedback ein. Füge Schlagwörter hinzu und wähle eine Bewertung.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Feedback</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Schlagwörter, die dein Feedback beschreiben" {...field} />
                                    </FormControl>
                                    <FormDescription className="sr-only">
                                        Inhalt des Feedbacks
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col">
                            <span className="mb-1">Bewertung</span>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleStarClick(star)}
                                        className="focus:outline-none"
                                    >
                                        <Star className={rating >= star ? "text-yellow-500" : "text-gray-400"} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Button type="submit" className="self-end">
                            Absenden
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}