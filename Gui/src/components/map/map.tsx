'use client';

import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import {toast} from "sonner";

const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
};

const initialCenter = { lat: 48.4167, lng: 15.6167 };

export interface MapComponentRef {
    recenterMap: (address: string) => void;
}

const MapComponent = forwardRef<MapComponentRef>((props, ref) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCfMiJi1gvYZhSbmQqw2pK6vS2o9zERkvw",
    });

    const [center, setCenter] = useState(initialCenter);
    const mapRef = useRef<google.maps.Map | null>(null);

    const onLoad = (map: google.maps.Map) => {
        console.log("GoogleMap onLoad ausgeführt:", map);
        mapRef.current = map;
    };

    useImperativeHandle(ref, () => ({
        recenterMap(address: string) {
            console.log("recenterMap aufgerufen mit:", address);
            if (!window.google) {
                console.error('Google Maps API ist nicht verfügbar.');
                return;
            }
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status === 'OK' && results && results.length > 0) {
                    const location = results[0].geometry.location;
                    const newCenter = { lat: location.lat(), lng: location.lng() };
                    setCenter(newCenter);
                    if (mapRef.current) {
                        mapRef.current.panTo(newCenter);
                    }
                } else {
                    toast.error(`Ort ${address} nicht gefunden`)
                }
            });
        },
    }));

    return isLoaded ? (
        <GoogleMap
            onLoad={onLoad}
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{
                mapTypeControl: false,
                streetViewControl: false,
            }}
        >
            {/* Hier können weitere Komponenten wie Marker eingefügt werden */}
        </GoogleMap>
    ) : (
        <p>Loading...</p>
    );
});

MapComponent.displayName = "MapComponent";

export default React.memo(MapComponent);
