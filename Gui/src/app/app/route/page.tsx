"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import SearchRoute from "@/components/search/route";
import React, {useState} from "react";
import SiteHeader from "@/components/site-header";
import {Skeleton} from "@/components/ui/skeleton";
import MapComponent from "@/components/map/map";

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
                        console.error("Route konnte nicht berechnet werden: " + status);
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

                    <Skeleton className="row-span-2"/>

                    <Card className="flex flex-col h-full max-h-screen">
                        <CardHeader>
                            <CardTitle>Info</CardTitle>
                            <CardDescription>Info zur Route</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <MapComponent directions={directions} />
            </div>
        </>
    )
}