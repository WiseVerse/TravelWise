import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import React from "react";
import {deleteChatFetch} from "@/lib/fetch";

export default function DeleteDialog({ id, name }: { id: string, name: string }) {
    async function deleteChat() {
        await deleteChatFetch(id)
        window.location.reload()
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="icon" variant="outline" className="hover:bg-destructive/10">
                    <Trash2 className="text-destructive"/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Diese Aktion kann nicht rückgängig gemacht werden und wird diesen Chat für immer von unseren Servern löschen. <br/>
                        Ausgewählter Chat: {name}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Abbruch</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteChat()}>
                        Ok
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}