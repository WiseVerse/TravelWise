import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import SearchRoute from "@/components/search/route";
import {ScrollArea} from "@/components/ui/scroll-area";
import React from "react";

export default function Page(){
    return (
        <div className="card-container">
            <Card>
                <CardHeader>
                    <CardTitle>Route</CardTitle>
                    <CardDescription>Geben Sie eine Start und Ziel Adresse ein</CardDescription>
                </CardHeader>
                <CardContent>
                    <SearchRoute/>
                </CardContent>
            </Card>
            <Card className="flex flex-col h-full max-h-screen">
                <CardHeader>
                    <CardTitle>Info</CardTitle>
                    <CardDescription>Info zur Route</CardDescription>
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
    )
}