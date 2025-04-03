"use client"

import React, {useEffect, useRef, useState} from "react";
import SearchAddress from "@/components/search/address";
import SearchCoordinates from "@/components/search/coordinates";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import SiteHeader from "@/components/site-header";
import MapComponent, {MapComponentRef} from "@/components/map/map";
import ChatSheet from "@/components/chat/chat-sheet";
import {Button} from "@/components/ui/button";
import {MapPin} from "lucide-react";

export default function SearchPage() {
    const mapRef = useRef<MapComponentRef>(null);
    const [markerCoordinates, setMarkerCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [markerAddress, setMarkerAddress] = useState("");

    // Diese Funktion wird von SearchAddress aufgerufen, wenn eine Adresse eingegeben wird.
    const handleAddressSearch = (address: string) => {
        console.log("handleAddressSearch aufgerufen mit:", address, mapRef.current);
        if (mapRef.current) {
            try {
                mapRef.current.recenterMap(address);
            } catch (error) {
                console.log(error);
            }
        } else {
            console.warn("mapRef.current ist null");
        }
    };

    useEffect(() => {
        if (markerCoordinates && window.google) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: markerCoordinates }, (results, status) => {
                if (status === "OK" && results && results.length > 0) {
                    console.log("Reverse geocoding result:", results[0].formatted_address);
                    setMarkerAddress(results[0].formatted_address);
                } else {
                    console.error("Reverse geocoding failed:", status);
                    setMarkerAddress("");
                }
            });
        } else {
            setMarkerAddress("");
        }
    }, [markerCoordinates]);

    const coordinatesValue = markerCoordinates
        ? `${markerCoordinates.lat.toFixed(5)}, ${markerCoordinates.lng.toFixed(5)}`
        : "";
    return (
        <>
            <SiteHeader title="Suche"/>
            <div className="h-full relative">
                <div className="fixed w-96 z-20 m-2 flex flex-col gap-2">
                    <Tabs defaultValue="addresses">
                        <TabsList className="w-96">
                            <TabsTrigger value="addresses">Adresse</TabsTrigger>
                            <TabsTrigger value="coordinates">Koordinaten</TabsTrigger>
                        </TabsList>

                        <TabsContent value="addresses">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Suche</CardTitle>
                                    <CardDescription>Suchen Sie nach Adressen</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SearchAddress onSearchAction={handleAddressSearch} value={markerAddress}/>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="coordinates">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Suche</CardTitle>
                                    <CardDescription>Suchen Sie mit Koordinaten</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SearchCoordinates value={coordinatesValue} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                    <Button
                        variant="outline"
                        onClick={() => mapRef.current?.resetToUserLocation()}
                    >
                        <MapPin/>
                        Mein Standort
                    </Button>
                    
                    <ChatSheet/>

                </div>

                <MapComponent ref={mapRef} onMarkerChange={setMarkerCoordinates} />
            </div>
        </>
    );
}
