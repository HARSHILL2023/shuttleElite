import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { Navigation } from 'lucide-react';

const libraries = ['places'];
const mapContainerStyle = { width: '100%', height: '100%' };

const MapWidget = ({ ride }) => {
  const { driverLocation, pickup, drop, status, pickupName, dropName } = ride;
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);
  const [smoothDriverLoc, setSmoothDriverLoc] = useState(driverLocation);
  const animationRef = useRef(null);

  // Directions logic - Clear on change
  useEffect(() => {
    if (!isLoaded) return;
    
    // Reset directions when locations change to prevent stale routes
    setDirections(null);

    if (pickup?.lat && drop?.lat) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: new window.google.maps.LatLng(pickup.lat, pickup.lng),
          destination: new window.google.maps.LatLng(drop.lat, drop.lng),
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error("Tactical failure: Routing failed.", status);
          }
        }
      );
    }
  }, [isLoaded, pickup?.lat, pickup?.lng, drop?.lat, drop?.lng]);

  // Smooth Movement (LERP)
  useEffect(() => {
    if (!driverLocation?.lat) return;
    
    // If smooth location is too far or not set, jump to current
    if (!smoothDriverLoc || Math.abs(smoothDriverLoc.lat - driverLocation.lat) > 0.1) {
      setSmoothDriverLoc(driverLocation);
      return;
    }

    const startTime = Date.now();
    const duration = 2000;
    const startLoc = { ...smoothDriverLoc };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentLat = startLoc.lat + (driverLocation.lat - startLoc.lat) * progress;
      const currentLng = startLoc.lng + (driverLocation.lng - startLoc.lng) * progress;
      
      setSmoothDriverLoc({ lat: currentLat, lng: currentLng });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [driverLocation]);

  // Fit view logic
  useEffect(() => {
    if (map && isLoaded) {
      const bounds = new window.google.maps.LatLngBounds();
      let hasData = false;
      if (pickup?.lat) { bounds.extend(pickup); hasData = true; }
      if (drop?.lat) { bounds.extend(drop); hasData = true; }
      if (smoothDriverLoc?.lat) { bounds.extend(smoothDriverLoc); hasData = true; }
      
      if (hasData) {
        map.fitBounds(bounds, { top: 100, bottom: 250, left: 50, right: 50 });
      }
    }
  }, [map, isLoaded, pickup, drop, smoothDriverLoc]);

  const onMapLoad = (mapInstance) => setMap(mapInstance);

  if (loadError) return <div className="h-full w-full bg-slate-900 rounded-3xl flex items-center justify-center text-red-500 font-bold border border-red-500/20 uppercase tracking-widest">Satellite Feed Offline</div>;
  if (!isLoaded) return <div className="h-full w-full bg-slate-900/50 animate-pulse rounded-3xl flex items-center justify-center font-bold text-primary/40 uppercase tracking-[0.4em]">Initializing Tactical Map...</div>;

  return (
    <div className="h-full min-h-[500px] w-full rounded-3xl overflow-hidden border border-white/5 relative shadow-2xl bg-slate-950">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={smoothDriverLoc || pickup}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
          gestureHandling: 'greedy',
          styles: [
            { elementType: "geometry", stylers: [{ color: "#212121" }] },
            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
            { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#121212" }] },
            { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
          ],
        }}
      >
        {directions && (
          <DirectionsRenderer 
            directions={directions} 
            options={{
              polylineOptions: { 
                strokeColor: '#22c55e', // Elite Green route
                strokeWeight: 5, 
                strokeOpacity: 0.8 
              },
              preserveViewport: true,
              suppressMarkers: true
            }}
          />
        )}

        {/* Pickup Pin */}
        {pickup?.lat && (
          <MarkerF 
            position={pickup} 
            title={`Pickup Node: ${pickupName}`}
            icon={{
              url: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png', // Bus stop icon
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20)
            }}
          />
        )}

        {/* Drop Pin */}
        {drop?.lat && (
          <MarkerF 
            position={drop} 
            title={`Destination Node: ${dropName}`}
            icon={{
              url: 'https://cdn-icons-png.flaticon.com/512/619/619032.png', // Office building icon
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20)
            }}
          />
        )}

        {/* Real-time Bus Icon */}
        {smoothDriverLoc?.lat && (
          <MarkerF 
            position={smoothDriverLoc} 
            icon={{
              url: '/bus.png', // Local shuttle asset
              scaledSize: new window.google.maps.Size(60, 60),
              anchor: new window.google.maps.Point(30, 30),
            }}
            zIndex={999}
          />
        )}
      </GoogleMap>
      
      {/* Status Overlay */}
      <div className="absolute top-6 left-6 z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-slate-900/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-ping absolute inset-0 opacity-20" />
            <div className="w-2.5 h-2.5 bg-primary rounded-full relative" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 font-black text-[9px] uppercase tracking-[0.3em] leading-none mb-1">Shuttle Status</span>
            <span className="text-white font-black text-[11px] uppercase tracking-wider">{status?.replace('_', ' ') || 'Syncing...'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapWidget;
