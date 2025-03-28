"use client"

import SiteHeader from "@/components/site-header";
import {chat} from "@/lib/types";
import React, {useEffect} from "react";
import {fetchChats} from "@/lib/fetch";
import {DataTable} from "@/app/app/chats/data-table";
import {columns} from "@/app/app/chats/columns";
import {LoaderCircle} from "lucide-react";

export default function AllChatPage() {
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState<chat[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchChats().then(c => setData(c))
        }

        fetchData().then(() => setLoading(false))
    }, []);
    
    return (
        <>
            <SiteHeader title="Chats" />
            {loading ? (
                <div className="h-full flex justify-center items-center">
                    <LoaderCircle className="animate-spin"/>
                </div>
            ) : (
                <DataTable columns={columns} data={data} />
            )}
        </>
    )
}
