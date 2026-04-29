import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { Navigation } from 'lucide-react';

const libraries = ['places'];
const mapContainerStyle = { width: '100%', height: '100%' };

const MapWidget = ({ ride }) => {
  const { driverLocation, pickupLocation, dropLocation, status } = ride;
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);
  const [smoothDriverLoc, setSmoothDriverLoc] = useState(driverLocation);
  const animationRef = useRef(null);

  // Directions logic
  useEffect(() => {
    if (isLoaded && pickupLocation?.lat && dropLocation?.lat) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: new window.google.maps.LatLng(pickupLocation.lat, pickupLocation.lng),
          destination: new window.google.maps.LatLng(dropLocation.lat, dropLocation.lng),
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          }
        }
      );
    }
  }, [isLoaded, pickupLocation, dropLocation]);

  // Smooth Movement (LERP)
  useEffect(() => {
    if (!driverLocation?.lat) return;
    if (!smoothDriverLoc) {
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
      if (pickupLocation?.lat) { bounds.extend(pickupLocation); hasData = true; }
      if (dropLocation?.lat) { bounds.extend(dropLocation); hasData = true; }
      if (smoothDriverLoc?.lat) { bounds.extend(smoothDriverLoc); hasData = true; }
      
      if (hasData) {
        map.fitBounds(bounds, { top: 100, bottom: 250, left: 50, right: 50 });
      }
    }
  }, [map, isLoaded, pickupLocation, dropLocation, smoothDriverLoc]);

  const onMapLoad = (mapInstance) => setMap(mapInstance);

  if (loadError) return <div className="h-full w-full bg-slate-50 rounded-3xl flex items-center justify-center text-red-500 font-bold">Map Loading Failed</div>;
  if (!isLoaded) return <div className="h-full w-full bg-slate-50 animate-pulse rounded-3xl flex items-center justify-center font-bold text-slate-300">Initializing Map Engine...</div>;

  return (
    <div className="h-full min-h-[500px] w-full rounded-3xl overflow-hidden border border-slate-200 relative shadow-sm">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={smoothDriverLoc || pickupLocation}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
          gestureHandling: 'greedy',
        }}
      >
        {directions && (
          <DirectionsRenderer 
            directions={directions} 
            options={{
              polylineOptions: { 
                strokeColor: '#000000', // Black route line as in image
                strokeWeight: 6, 
                strokeOpacity: 0.9 
              },
              preserveViewport: true,
              suppressMarkers: true
            }}
          />
        )}

        {/* Pickup Pin - Green Circle with dot */}
        {pickupLocation?.lat && (
          <MarkerF 
            position={pickupLocation} 
            icon={{
              url: 'https://cdn-icons-png.flaticon.com/512/3515/3515254.png', // Green dot/target
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20)
            }}
          />
        )}

        {/* Drop Pin - Red Circle with square */}
        {dropLocation?.lat && (
          <MarkerF 
            position={dropLocation} 
            icon={{
              url: 'https://cdn-icons-png.flaticon.com/512/3515/3515255.png', // Red square/target
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20)
            }}
          />
        )}

        {/* Real-time Car Icon */}
        {smoothDriverLoc?.lat && (
          <MarkerF 
            position={smoothDriverLoc} 
            icon={{
              url: 'https://cdn-icons-png.flaticon.com/512/1048/1048315.png', // Better white car icon
              scaledSize: new window.google.maps.Size(45, 45),
              anchor: new window.google.maps.Point(22, 22),
            }}
            zIndex={999}
          />
        )}
      </GoogleMap>
      
      {/* Status Overlay */}
      <div className="absolute top-6 left-6 z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-4">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-black rounded-full animate-ping absolute inset-0 opacity-20" />
            <div className="w-2.5 h-2.5 bg-black rounded-full relative" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 font-black text-[9px] uppercase tracking-[0.3em] leading-none mb-1">Live Telemetry</span>
            <span className="text-black font-black text-[11px] uppercase tracking-wider">{status?.replace('_', ' ') || 'Syncing...'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapWidget;
