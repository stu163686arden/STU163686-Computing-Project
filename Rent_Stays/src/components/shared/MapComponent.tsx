import { useCallback, useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0.75rem'
};

const defaultCenter = {
    lat: 51.5074, // London
    lng: -0.1278
};

// Custom Map Styles - minimal styling to keep it clean but colorful
const mapStyles = [
    {
        "featureType": "poi.business",
        "elementType": "labels",
        "stylers": [{ "visibility": "off" }]
    }
];

interface MarkerType {
    lat: number;
    lng: number;
    title?: string;
}

interface MapComponentProps {
    center?: { lat: number; lng: number };
    zoom?: number;
    markers?: MarkerType[];
    address?: string;
    className?: string;
}

const MapComponent = ({ center = defaultCenter, zoom = 15, markers = [], address, className = "h-[400px] w-full" }: MapComponentProps) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [mapCenter, setMapCenter] = useState(center);
    const [mapMarkers, setMapMarkers] = useState<MarkerType[]>(markers);
    const mapRef = useRef<google.maps.Map | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        mapRef.current = map;
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        mapRef.current = null;
        setMap(null);
    }, []);

    useEffect(() => {
        setMapCenter(center);
        setMapMarkers(markers);
    }, [center, markers]);

    useEffect(() => {
        if (isLoaded && address && window.google) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const location = results[0].geometry.location;
                    const newCenter = {
                        lat: location.lat(),
                        lng: location.lng()
                    };
                    setMapCenter(newCenter);
                    setMapMarkers([{
                        lat: newCenter.lat,
                        lng: newCenter.lng,
                        title: address
                    }]);

                    // Smoothly pan to the new center
                    if (mapRef.current) {
                        mapRef.current.panTo(newCenter);
                        mapRef.current.setZoom(16); // Closer zoom for specific address
                    }
                } else {
                    console.error('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
    }, [isLoaded, address]);

    // Custom SVG Marker Icon
    const customMarkerIcon = {
        path: "M12 0C7.58 0 4 3.58 4 8c0 5.25 7 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z",
        fillColor: "#EA4335", // Google Red or Primary Color
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#FFFFFF",
        scale: 2,
        anchor: isLoaded && window.google ? new window.google.maps.Point(12, 21) : undefined,
    };

    if (!isLoaded) {
        return (
            <div className={`flex items-center justify-center bg-muted/20 rounded-xl ${className}`}>
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className={className}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: true,
                    mapTypeControl: false,
                    fullscreenControl: true,
                    scrollwheel: true, // Allow scrolling to zoom
                    gestureHandling: "cooperative", // Better UX for scrolling pages
                    styles: mapStyles,
                }}
            >
                {mapMarkers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        title={marker.title}
                        icon={customMarkerIcon}
                        animation={isLoaded && window.google ? window.google.maps.Animation.DROP : undefined}
                    />
                ))}
            </GoogleMap>
        </div>
    );
};

export default MapComponent;
