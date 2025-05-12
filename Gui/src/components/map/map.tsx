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

interface MapComponentProps {
    onMarkerChange?: (coords: { lat: number; lng: number } | null) => void;
    directions?: google.maps.DirectionsResult | null;
    markerAllowed?: boolean;
}

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>((props, ref) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCfMiJi1gvYZhSbmQqw2pK6vS2o9zERkvw",
        libraries: ['places'],
    });

    const [center, setCenter] = useState(initialCenter);
    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [showInfoWindow, setShowInfoWindow] = useState(false);

    // Zustände für Place-Details
    const [placeDetails, setPlaceDetails] = useState<google.maps.places.PlaceResult | null>(null);
    const [placeInfoPosition, setPlaceInfoPosition] = useState<{ lat: number; lng: number } | null>(null);

    const mapRef = useRef<google.maps.Map | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

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
        placesServiceRef.current = new google.maps.places.PlacesService(map);
    };

    const updateMarker = (position: { lat: number; lng: number } | null) => {
        setMarkerPosition(position);
        props.onMarkerChange?.(position);
    };

    useImperativeHandle(ref, () => ({
        recenterMap(address: string) {
            if (!window.google) {
                console.error('Google Maps API ist nicht verfügbar.');
                return;
            }
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status === 'OK' && results?.length) {
                    const loc = results[0].geometry.location;
                    const newCenter = { lat: loc.lat(), lng: loc.lng() };
                    setCenter(newCenter);
                    updateMarker(newCenter);
                    mapRef.current?.panTo(newCenter);
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
                mapRef.current?.panTo(userLocation);
            } else {
                toast.error("Keine gespeicherte Benutzerposition gefunden.");
            }
        },
    }));

    interface MapMouseEventWithPlaceId extends google.maps.MapMouseEvent {
        placeId?: string;
    }

    const handleMapClick = (e: MapMouseEventWithPlaceId) => {
        // Klick auf POI: Place-Details abrufen
        if (e.placeId && placesServiceRef.current && e.latLng) {
            e.stop();
            const request: google.maps.places.PlaceDetailsRequest = {
                placeId: e.placeId,
                fields: ['name', 'formatted_address', 'rating', 'opening_hours'],
            };
            placesServiceRef.current.getDetails(request, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                    setPlaceDetails(place);
                    setPlaceInfoPosition({ lat: e.latLng!.lat(), lng: e.latLng!.lng() });
                } else {
                    toast.error('Details zum Ort konnten nicht geladen werden.');
                }
            });
            return;
        }

        // Marker setzen nur, wenn erlaubt
        if (markerAllowed && e.latLng) {
            const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            updateMarker(pos);
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
                clickableIcons: true,
            }}
        >
            {props.directions && <DirectionsRenderer directions={props.directions} />}
            {userLocation && (
                <Marker
                    position={userLocation}
                    icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#4285F4',
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: 'white',
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
                                updateMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
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

            {/* InfoWindow für Place-Details */}
            {placeDetails && placeInfoPosition && (
                <InfoWindow
                    position={placeInfoPosition}
                    onCloseClick={() => setPlaceDetails(null)}
                >
                    <div>
                        <h3>{placeDetails.name}</h3>
                        <p>{placeDetails.formatted_address}</p>
                        {placeDetails.rating && <p>Bewertung: {placeDetails.rating} Sterne</p>}
                        {placeDetails.opening_hours?.weekday_text && (
                            <ul>
                                {placeDetails.opening_hours.weekday_text.map((line, i) => (
                                    <li key={i}>{line}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    ) : (
        <p>Loading...</p>
    );
});

MapComponent.displayName = 'MapComponent';
export default React.memo(MapComponent);
