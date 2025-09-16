import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api'
import { useCallback, useEffect, useState } from 'react'

const GOOGLE_MAPS_API_KEY = "AIzaSyCzABPuBhxfr8aDGGgW9fu1ddeGpduvx4E" // IMPORTANT: Replace with your actual Google Maps API key

const containerStyle = {
  width: '100%',
  height: '100%',
}

export default function MapView({ 
  patient, 
  facilities, 
  facility, 
  patients, 
  hoveredFacility, 
  selectedFacility, 
  hoveredPatient, 
  onDirectionsResult 
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  })

  const [map, setMap] = useState(null)
  const [directionsResponse, setDirectionsResponse] = useState(null)

  const onLoad = useCallback(mapInstance => {
    setMap(mapInstance)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  useEffect(() => {
    if (!selectedFacility || !isLoaded || !patient) {
      setDirectionsResponse(null);
      if (onDirectionsResult) onDirectionsResult(null);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: patient.loc_lat, lng: patient.loc_long },
        destination: { lat: selectedFacility.loc_lat, lng: selectedFacility.loc_long },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
          if (onDirectionsResult) onDirectionsResult(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
          if (onDirectionsResult) onDirectionsResult(null);
        }
      }
    );
  }, [selectedFacility, isLoaded, patient, onDirectionsResult]);

  useEffect(() => {
    if (map && isLoaded && !directionsResponse) {
      const bounds = new window.google.maps.LatLngBounds()

      if (patient && facilities) { // Referrals mode
        bounds.extend({ lat: patient.loc_lat, lng: patient.loc_long })
  
        if (hoveredFacility) {
          bounds.extend({ lat: hoveredFacility.loc_lat, lng: hoveredFacility.loc_long })
          map.fitBounds(bounds, 50)
        } else {
          facilities.forEach(p => bounds.extend({ lat: p.loc_lat, lng: p.loc_long }))
          if (facilities.length > 0) {
            map.fitBounds(bounds, 50)
          } else {
            map.panTo({ lat: patient.loc_lat, lng: patient.loc_long })
            map.setZoom(9)
          }
        }
      } else if (facility && patients) { // Facilities mode
        bounds.extend({ lat: facility.loc_lat, lng: facility.loc_long });
        
        if (hoveredPatient) {
          bounds.extend({ lat: hoveredPatient.loc_lat, lng: hoveredPatient.loc_long });
          map.fitBounds(bounds, 50);
        } else {
            patients.forEach(p => bounds.extend({ lat: p.loc_lat, lng: p.loc_long }));
            if (patients.length > 0) {
              map.fitBounds(bounds, 50);
            } else {
              map.panTo({ lat: facility.loc_lat, lng: facility.loc_long });
              map.setZoom(12);
            }
        }
      }
    }
  }, [map, patient, facilities, facility, patients, hoveredFacility, hoveredPatient, isLoaded, directionsResponse])

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded || (!patient && !facility)) return <div>Loading Map...</div>
  
  const patientPinIcon = {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: '#ef4444',
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: 'white',
    scale: 1.5,
    anchor: isLoaded ? new window.google.maps.Point(12, 24) : null,
  };

  const facilityPinIcon = {
    ...patientPinIcon,
    fillColor: '#3b82f6', // blue
  };

  const patientIcon = (color, isHovered) => ({
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: isHovered ? 8 : 5,
    fillColor: color, // Use dynamic color
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: "white",
  })

  const getMatchColor = (item) => {
    const percentage = item.capabilityMatch?.percentage;
    if (percentage === undefined) return '#6b7280'; // Default gray
    if (percentage === 100) return '#10b981'; // green
    if (percentage > 0) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  }

  const facilityIcon = (color, isHovered) => ({
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: isHovered ? 8 : 5,
    fillColor: color,
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: "white",
  })
  
  const facilityColor = (facility) => {
    const percentage = facility.capabilityMatch?.percentage;
    if (percentage === undefined) return '#6b7280'; // Default gray
    if (percentage === 100) return '#10b981'; // green
    if (percentage > 0) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {patient && facilities && (
        <>
          <Marker 
            position={{ lat: patient.loc_lat, lng: patient.loc_long }} 
            title={patient.name}
            icon={patientPinIcon}
            zIndex={20} // Patient pin is always on top
          />
          
          {facilities
            .filter(f => !selectedFacility || f.name === selectedFacility.name)
            .map(p => (
            <Marker
              key={p.name}
              position={{ lat: p.loc_lat, lng: p.loc_long }}
              title={p.name}
              icon={facilityIcon(getMatchColor(p), hoveredFacility?.name === p.name)}
              zIndex={hoveredFacility?.name === p.name ? 15 : 5}
            />
          ))}
        </>
      )}

      {facility && patients && (
        <>
          <Marker 
            position={{ lat: facility.loc_lat, lng: facility.loc_long }} 
            title={facility.name}
            icon={facilityPinIcon}
            zIndex={20}
          />
          {patients.map(p => (
            <Marker
              key={p.id}
              position={{ lat: p.loc_lat, lng: p.loc_long }}
              title={p.name}
              icon={patientIcon(getMatchColor(p), hoveredPatient?.id === p.id)}
              zIndex={hoveredPatient?.id === p.id ? 15 : 5}
            />
          ))}
        </>
      )}

      {directionsResponse && (
        <DirectionsRenderer
          options={{ 
            directions: directionsResponse,
            suppressMarkers: true, // We use our own custom markers
            polylineOptions: {
              strokeColor: '#095d7e',
              strokeWeight: 5,
            },
          }} 
        />
      )}
    </GoogleMap>
  )
}
