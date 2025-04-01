"use client"

import React, {useRef} from "react";
import SearchAddress from "@/components/search/address";
import SearchCoordinates from "@/components/search/coordinates";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import SiteHeader from "@/components/site-header";
import MapComponent, {MapComponentRef} from "@/components/map/map";
import {Button} from "@/components/ui/button";
import {SquareArrowOutUpRight} from "lucide-react";
import Link from "next/link";

export default function SearchPage() {

    const mapRef = useRef<MapComponentRef>(null);

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
                                    <SearchCoordinates/>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Chat</CardTitle>
                            <CardDescription>Weiter zum Chat</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button size="icon" variant="outline" asChild>
                                <Link href="">
                                    <SquareArrowOutUpRight/>
                                    
                                </Link>
                                
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                
                <MapComponent ref={mapRef}/>
            </div>
        </>
    );
}
