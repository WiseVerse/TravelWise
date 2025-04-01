"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {LoaderCircle} from "lucide-react";

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        router.push("/app");
    });
    
    return (
        <div className="h-full flex justify-center items-center">
            <LoaderCircle className="animate-spin"/>
        </div>
    )
}