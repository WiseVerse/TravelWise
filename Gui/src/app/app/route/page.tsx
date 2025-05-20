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
    const [distance, setDistance] = useState<string>("");
    const [duration, setDuration] = useState<string>("");

    const handleRouteSubmit = (data: { start: string; stops?: string; end: string; mode: google.maps.TravelMode }) => {
        if (window.google) {
            const directionsService = new window.google.maps.DirectionsService();

            // Wenn Zwischenstopps vorhanden sind, werden diese als Waypoints eingebunden.
            const waypoints = data.stops && data.stops.trim() !== ""
                ? data.stops.split(",").map(stop => ({
                    location: stop.trim(),
                    stopover: true,
                }))
                : [];

            directionsService.route(
                {
                    origin: data.start,
                    destination: data.end,
                    travelMode: data.mode,
                    ...(waypoints.length > 0 && { waypoints }),
                },
                (result, status) => {
                    if (status === "OK" && result) {
                        console.log("Route berechnet:", result);
                        setDirections(result);
                        const legs = result.routes[0].legs;

                        // später für fetch an Nick
                        const routeAbschnitte = legs.map((leg, index) => ({
                            abschnitt: index + 1, // Nur Nummerierung
                            entfernung: leg.distance?.text || "",
                            dauer: leg.duration?.text || "",
                            start: {
                                adresse: leg.start_address,
                                koordinaten: {
                                    lat: leg.start_location.lat(),
                                    lng: leg.start_location.lng()
                                }
                            },
                            ziel: {
                                adresse: leg.end_address,
                                koordinaten: {
                                    lat: leg.end_location.lat(),
                                    lng: leg.end_location.lng()
                                }
                            }
                        }));
                        console.log("Fetch Objekt:", routeAbschnitte);

                        const totalDistanceInMeters = legs.reduce(
                            (total, leg) => total + (leg.distance?.value || 0),
                            0
                        );
                        const totalDurationInSeconds = legs.reduce(
                            (total, leg) => total + (leg.duration?.value || 0),
                            0
                        );

                        // Entfernung in Kilometer formatiert
                        const totalDistanceKm = (totalDistanceInMeters / 1000).toFixed(2) + " km";

                        // Dauer in Stunden und Minuten umrechnen
                        const hours = Math.floor(totalDurationInSeconds / 3600);
                        const minutes = Math.floor((totalDurationInSeconds % 3600) / 60);
                        const totalDurationFormatted =
                            hours > 0 ? `${hours} Std ${minutes} Min` : `${minutes} Min`;

                        setDistance(totalDistanceKm);
                        setDuration(totalDurationFormatted);
                    } else {
                        toast.error("Route konnte nicht berechnet werden. Versuchen Sie, das Zielland nach der Adresse hinzuzufügen");
                    }
                }
            );
        }
    };

    const handleRouteClear = () => {
        setDirections(null);
        setDistance("");
        setDuration("");
    };

    return (
        <>
            <SiteHeader title="Route" />
            <div className="h-full relative">
                <div className="fixed w-96 z-20 m-2 flex flex-col gap-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Route</CardTitle>
                            <CardDescription>
                                Geben Sie eine Start-, Zieladresse, optional Zwischenstopps und den Fortbewegungsmodus ein
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SearchRoute onRouteSubmit={handleRouteSubmit} onRouteClear={handleRouteClear} />
                            {distance && duration && (
                                <div className="mt-4 space-y-1 p-2 bg-gray-50 rounded-md">
                                    <p className="font-medium">Entfernung: <span className="font-normal">{distance}</span></p>
                                    <p className="font-medium">Fahrzeit: <span className="font-normal">{duration}</span></p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Button variant="outline" onClick={() => mapRef.current?.resetToUserLocation()}>
                        <MapPin />
                        Mein Standort
                    </Button>
                    <ChatSheet />
                </div>
                {/* Pointer zum Setzen von Markern ist standardmäßig deaktiviert (markerAllowed: false) */}
                <MapComponent ref={mapRef} directions={directions} />
            </div>
        </>
    );
}