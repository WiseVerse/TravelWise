import SearchAddress from "@/app/app/SearchAddress";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import SearchCoordinates from "@/app/app/SearchCoordinates";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function Home() {
    return (
        <div className="h-full w-[20vw] m-2 grid grid-cols-1 grid-rows-[auto_1fr] gap-4">
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
                        ullamcorper, non commodo orci varius. Phasellus volutpat lacinia tortor vitae ullamcorper. Morbi
                        consequat augue tincidunt, lacinia arcu eu, consectetur ipsum. Nam maximus leo sed magna posuere
                        rhoncus. Pellentesque dignissim tellus vestibulum elit luctus tincidunt.
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
