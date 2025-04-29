"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SearchRoute from "@/components/search/route";
import React, { useRef, useState } from "react";
import SiteHeader from "@/components/site-header";
import MapComponent, { MapComponentRef } from "@/components/map/map";
import { toast } from "sonner";
import ChatSheet from "@/components/chat/chat-sheet";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function Page() {
    const mapRef = useRef<MapComponentRef>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    const handleRouteSubmit = (data: { start: string; stops?: string; end: string }) => {
        if (window.google) {
            const directionsService = new window.google.maps.DirectionsService();

            // Falls Zwischenstopps definiert wurden, werden diese als waypoints eingebunden.
            const waypoints = data.stops
                ? data.stops.split(",").map(stop => ({
                    location: stop.trim(),
                    stopover: true,
                }))
                : [];

            directionsService.route(
                {
                    origin: data.start,
                    destination: data.end,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                    // Waypoints nur hinzufügen, wenn welche vorhanden sind.
                    ...(waypoints.length > 0 && { waypoints }),
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
            <SiteHeader title="Route" />
            <div className="h-full relative">
                <div className="fixed w-96 z-20 m-2 flex flex-col gap-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Route</CardTitle>
                            <CardDescription>Geben Sie eine Start-, Zieladresse und optional Zwischenstopps ein</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SearchRoute onRouteSubmit={handleRouteSubmit} onRouteClear={handleRouteClear} />
                        </CardContent>
                    </Card>
                    <Button variant="outline" onClick={() => mapRef.current?.resetToUserLocation()}>
                        <MapPin />
                        Mein Standort
                    </Button>

                    <ChatSheet />
                </div>
                <MapComponent ref={mapRef} directions={directions} />
            </div>
        </>
    );
}