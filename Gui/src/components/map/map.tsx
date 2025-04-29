'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import { toast } from "sonner";

const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
};

const initialCenter = { lat: 48.4167, lng: 15.6167 };

export interface MapComponentRef {
    recenterMap: (address: string) => void;
    clearMarker: () => void;
    resetToUserLocation: () => void;
}

// Neuer Prop markerAllowed, der standardmäßig false ist.
interface MapComponentProps {
    onMarkerChange?: (coords: { lat: number; lng: number } | null) => void;
    directions?: google.maps.DirectionsResult | null;
    markerAllowed?: boolean;
}

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>((props, ref) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCfMiJi1gvYZhSbmQqw2pK6vS2o9zERkvw",
    });

    const [center, setCenter] = useState(initialCenter);
    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [showInfoWindow, setShowInfoWindow] = useState(false);
    const mapRef = useRef<google.maps.Map | null>(null);

    // Default für markerAllowed auf false setzen
    const markerAllowed = props.markerAllowed ?? false;

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                async (error) => {
                    console.warn("Fehler beim Abrufen des Standorts, versuche IP-Standort:", error.message);
                    try {
                        const res = await fetch("https://ipapi.co/json/");
                        const data = await res.json();
                        if (data && data.latitude && data.longitude) {
                            setUserLocation({ lat: data.latitude, lng: data.longitude });
                            setCenter({ lat: data.latitude, lng: data.longitude });
                        } else {
                            // noinspection ExceptionCaughtLocallyJS
                            throw new Error("Keine Standortdaten erhalten.");
                        }
                    } catch (err) {
                        console.error("Fehler bei der IP-Standortabfrage:", err);
                        toast.error("Standort nicht verfügbar, Standardwert wird genutzt.");
                        setUserLocation({ lat: 52.5200, lng: 13.4050 });
                        setCenter({ lat: 52.5200, lng: 13.4050 });
                    }
                }
            );
        }
    }, []);

    const onLoad = (map: google.maps.Map) => {
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
                    updateMarker(newCenter);
                    if (mapRef.current) {
                        mapRef.current.panTo(newCenter);
                    }
                } else {
                    toast.error(`Kein Ort namens ${address} gefunden`);
                }
            });
        },
        clearMarker() {
            updateMarker(null);
            setShowInfoWindow(false);
        },
        resetToUserLocation() {
            if (userLocation) {
                setCenter(userLocation);
                if (mapRef.current) {
                    mapRef.current.panTo(userLocation);
                }
                console.log("Karte zurückgesetzt auf gespeicherte Position:", userLocation);
            } else {
                toast.error("Keine gespeicherte Benutzerposition gefunden.");
            }
        },
    }));

    // Marker setzen nur, wenn markerAllowed true ist.
    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!markerAllowed) return;
        if (e.latLng) {
            const clickedPosition = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            };
            updateMarker(clickedPosition);
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
            {props.directions && <DirectionsRenderer directions={props.directions} />}
            {userLocation && (
                <Marker
                    position={userLocation}
                    icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "white",
                    }}
                />
            )}
            {markerPosition && (
                <>
                    <Marker
                        draggable
                        position={markerPosition}
                        onClick={() => setShowInfoWindow(true)}
                        onDragEnd={(e) => {
                            if (e.latLng) {
                                const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                                updateMarker(newPosition);
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
            )}
        </GoogleMap>
    ) : (
        <p>Loading...</p>
    );
});

MapComponent.displayName = "MapComponent";

export default React.memo(MapComponent);