import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Default center (Bangalore)
const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946
};

const MapWidget = ({ pickup = "Electronic City, Bangalore", drop = "Koramangala, Bangalore", status }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (isLoaded && pickup && drop) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickup,
          destination: drop,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${status}`);
          }
        }
      );
    }
  }, [isLoaded, pickup, drop]);

  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  if (loadError) return <div className="h-full w-full flex items-center justify-center text-red-500 bg-card rounded-[2rem]">Error loading map</div>;
  if (!isLoaded) return <div className="h-full w-full bg-card animate-pulse rounded-[2rem]" />;

  return (
    <div className="h-[400px] md:h-[500px] w-full rounded-[2.5rem] overflow-hidden border border-white/5 relative group">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={defaultCenter}
        onLoad={onMapLoad}
        options={{
          styles: darkMapStyle,
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {directions && (
          <DirectionsRenderer 
            directions={directions} 
            options={{
              polylineOptions: {
                strokeColor: '#22C55E',
                strokeWeight: 6,
                strokeOpacity: 0.8
              }
            }}
          />
        )}
      </GoogleMap>

      {/* Overlay Status */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-[#0F172A]/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl">
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.2em]">{status || 'Live Tracking'}</span>
        </div>
      </div>

      {/* Bottom Info Overlay (Optional) */}
      <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end pointer-events-none">
        <div className="bg-[#0F172A]/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-2xl pointer-events-auto">
           <p className="text-[8px] font-black text-text-dim uppercase tracking-widest mb-1">Current Route</p>
           <p className="text-xs font-bold text-text-main flex items-center gap-2">
             {pickup.split(',')[0]} <span className="text-primary">→</span> {drop.split(',')[0]}
           </p>
        </div>
      </div>
    </div>
  );
};

// Dark Mode Map Styles
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0F172A" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0F172A" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#475569" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94A3B8" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94A3B8" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1E293B" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748B" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1E293B" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334155" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94A3B8" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#334155" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#475569" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#CBD5E1" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#1E293B" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94A3B8" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#020617" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#334155" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#0F172A" }],
  },
];

export default MapWidget;
