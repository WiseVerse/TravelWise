"use client"

import React, { useRef } from "react";
import SearchAddress from "@/components/search/address";
import SearchCoordinates from "@/components/search/coordinates";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea} from "@/components/ui/scroll-area";
import SiteHeader from "@/components/site-header";
import MapComponent, { MapComponentRef } from "@/components/map/map";
export default function SearchPage() {

    const mapRef = useRef<MapComponentRef>(null);

    // Diese Funktion wird von SearchAddress aufgerufen, wenn eine Adresse eingegeben wird.
    const handleAddressSearch = (address: string) => {
        console.log("handleAddressSearch aufgerufen mit:", address, mapRef.current);
        if (mapRef.current) {
            mapRef.current.recenterMap(address);
        } else {
            console.warn("mapRef.current ist null");
        }
    };

    return (
        <>
            <SiteHeader title="Suche"/>
            <div className="relative w-screen" style={{ height: "calc(100vh - 4rem)" }}>
                {/* Karte im Hintergrund */}
                <div className="absolute inset-0 z-0">
                    <MapComponent ref={mapRef} />
                </div>

                {/* Overlay für die UI, oben links positioniert */}
                <div className="absolute top-0 left-0 z-10 p-4">
                    {/* Container für Tabs/UI – z.B. feste Breite  w-96 */}
                    <div className="w-96 space-y-4 bg-transparent p-4 rounded">
                        {/* TABS */}
                        <Tabs defaultValue="addresses">
                            {/* TabsList inline-flex, damit die Tabs nur so breit wie ihr Inhalt sind */}
                            <TabsList className="inline-flex space-x-2">
                                <TabsTrigger value="addresses">Adresse</TabsTrigger>
                                <TabsTrigger value="coordinates">Koordinaten</TabsTrigger>
                            </TabsList>

                            {/* Inhalt Tab "Adresse" */}
                            <TabsContent value="addresses" className="pt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Suche</CardTitle>
                                        <CardDescription>Suchen Sie nach Adressen</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <SearchAddress onSearch={handleAddressSearch} />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Inhalt Tab "Koordinaten" */}
                            <TabsContent value="coordinates" className="pt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Suche</CardTitle>
                                        <CardDescription>Suchen Sie mit Koordinaten</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <SearchCoordinates />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {/* INFO-CARD */}
                        <Card className="flex flex-col h-[40vh]">
                            <CardHeader>
                                <CardTitle>Info</CardTitle>
                                <CardDescription>Info zum Ort Musterstraße 1</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden min-h-0">
                                <ScrollArea className="h-full overflow-y-auto">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                                    molestie libero lacus, at feugiat diam porta pulvinar...
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                                    molestie libero lacus, at feugiat diam porta pulvinar...
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                                    molestie libero lacus, at feugiat diam porta pulvinar...
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                                    molestie libero lacus, at feugiat diam porta pulvinar...
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                                    molestie libero lacus, at feugiat diam porta pulvinar...
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                                    molestie libero lacus, at feugiat diam porta pulvinar...
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
