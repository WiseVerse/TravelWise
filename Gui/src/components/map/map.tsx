'use client';

import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
};

const initialCenter = { lat: 48.4167, lng: 15.6167 };

export interface MapComponentRef {
    recenterMap: (address: string) => void;
    clearMarker: () => void;
}

interface MapComponentProps {
    onMarkerChange?: (coords: { lat: number; lng: number } | null) => void;
    directions?: google.maps.DirectionsResult | null;
}

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>((props, ref) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCfMiJi1gvYZhSbmQqw2pK6vS2o9zERkvw",
    });

    const [center, setCenter] = useState(initialCenter);
    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [showInfoWindow, setShowInfoWindow] = useState(false);
    const mapRef = useRef<google.maps.Map | null>(null);

    const onLoad = (map: google.maps.Map) => {
        console.log("GoogleMap onLoad ausgeführt:", map);
        mapRef.current = map;
    };

    const updateMarker = (position: { lat: number; lng: number } | null) => {
        setMarkerPosition(position);
        if (props.onMarkerChange) {
            props.onMarkerChange(position);
        }
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
                    updateMarker(newCenter); // Marker an der neuen Position setzen
                    // InfoWindow NICHT direkt anzeigen
                    if (mapRef.current) {
                        mapRef.current.panTo(newCenter);
                    }
                } else {
                    console.error('Geocode war nicht erfolgreich: ' + status);
                }
            });
        },
        clearMarker() {
            console.log("clearMarker aufgerufen");
            updateMarker(null);
            setShowInfoWindow(false);
        },
    }));

    // Handler, der beim Klick auf die Karte ausgeführt wird
    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const clickedPosition = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            };
            updateMarker(clickedPosition);
            console.log("Map clicked at: ", clickedPosition);
        }
    };


    return isLoaded ? (
        <GoogleMap
            onLoad={onLoad}
            onClick={handleMapClick}
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{
                mapTypeControl: false,
                streetViewControl: false,
                cameraControl: false,
            }}
        >
            {props.directions ? (
                <DirectionsRenderer directions={props.directions} />
            ) : (
                markerPosition && (
                    <>
                        <Marker
                            draggable
                            position={markerPosition}
                            onClick={() => setShowInfoWindow(true)}
                            onDragEnd={(e) => {
                                const newLat = e.latLng?.lat();
                                const newLng = e.latLng?.lng();
                                if (newLat != null && newLng != null) {
                                    const newPosition = { lat: newLat, lng: newLng };
                                    updateMarker(newPosition);
                                    console.log("Neue Markerkoordinaten:", newPosition);
                                }
                            }}
                        />
                        {showInfoWindow && (
                            <InfoWindow
                                position={markerPosition}
                                onCloseClick={() => setShowInfoWindow(false)}
                            >
                                <div>
                                    <button
                                        style={{
                                            background: 'red',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            updateMarker(null);
                                            setShowInfoWindow(false);
                                        }}
                                    >
                                        X
                                    </button>
                                </div>
                            </InfoWindow>
                        )}
                    </>
                )
            )}
        </GoogleMap>
    ) : (
        <p>Loading...</p>
    );
});

MapComponent.displayName = "MapComponent";

export default React.memo(MapComponent);
