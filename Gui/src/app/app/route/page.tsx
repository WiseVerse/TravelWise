"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import SearchRoute from "@/components/search/route";
import React, {useState} from "react";
import SiteHeader from "@/components/site-header";
import MapComponent from "@/components/map/map";
import {toast} from "sonner";
import ChatSheet from "@/components/chat/chat-sheet";

export default function Page() {
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    const handleRouteSubmit = (data: { start: string; end: string }) => {
        if (window.google) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: data.start,
                    destination: data.end,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === "OK" && result) {
                        console.log("Route berechnet:", result);
                        setDirections(result);
                    } else {
                        toast.error("Route konnte nicht berechnet werden. Versuchen Sie das Zielland nach der Adresse hinzuzufügen");
                    }
                }
            );
        }
    };

    const handleRouteClear = () => {
        setDirections(null);
    };

    return (
        <>
            <SiteHeader title="Route"/>
            <div className="h-full relative">
                <div className="fixed w-96 z-20 m-2 flex flex-col gap-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Route</CardTitle>
                            <CardDescription>Geben Sie eine Start und Ziel Adresse ein</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SearchRoute onRouteSubmit={handleRouteSubmit} onRouteClear={handleRouteClear}/>
                        </CardContent>
                    </Card>

                    <ChatSheet/>
                </div>
                <MapComponent directions={directions} />
            </div>
        </>
    )
}