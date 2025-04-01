"use client"

import React, {useRef, useState} from "react";
import SearchAddress from "@/components/search/address";
import SearchCoordinates from "@/components/search/coordinates";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import SiteHeader from "@/components/site-header";
import MapComponent, {MapComponentRef} from "@/components/map/map";
import ChatSheet from "@/components/chat/chat-sheet";

export default function SearchPage() {

    const mapRef = useRef<MapComponentRef>(null);
    const [markerCoordinates, setMarkerCoordinates] = useState<{ lat: number; lng: number } | null>(null);

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
                                    <SearchAddress onSearch={handleAddressSearch}/>
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

                    <ChatSheet/>

                </div>

                <MapComponent ref={mapRef} onMarkerChange={setMarkerCoordinates} />
            </div>
        </>
    );
}
