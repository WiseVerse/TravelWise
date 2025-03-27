import React from "react";
import SearchAddress from "@/components/search/address";
import SearchCoordinates from "@/components/search/coordinates";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea} from "@/components/ui/scroll-area";
import SiteHeader from "@/components/site-header";
import {Skeleton} from "@/components/ui/skeleton";

export default function SearchPage() {
    return (
        <>
            <SiteHeader title="Suche"/>
            <main className="card-container">
                <Tabs defaultValue="addresses">
                    <TabsList className="grid w-full grid-cols-2">
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
                                <SearchAddress/>
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
                
                <Skeleton className="row-span-2"/>
                
                <Card className="flex flex-col h-full max-h-screen">
                    <CardHeader>
                        <CardTitle>Info</CardTitle>
                        <CardDescription>Info zum Ort Musterstraße 1</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full max-h-screen overflow-auto">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam molestie libero lacus, at feugiat
                            diam porta pulvinar. Vestibulum mollis, orci eu convallis lobortis, justo magna tempus purus, in
                            euismod turpis diam eu odio. Morbi sit amet pellentesque lectus. Praesent euismod odio ut diam
                            ullamcorper, non commodo orci varius.
                        </ScrollArea>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
