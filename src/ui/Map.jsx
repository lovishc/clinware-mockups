import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'

const GOOGLE_MAPS_API_KEY = "GOOGLE_MAPS_API_KEY" // IMPORTANT: Replace with your actual Google Maps API key

const containerStyle = {
  width: '100%',
  height: '100%',
}

export default function Map({ facility, patients, hoveredPatient }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  })

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded || !facility) return <div>Loading Map...</div>

  const facilityIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: "#095d7e",
    fillOpacity: 1,
    strokeWeight: 3,
    strokeColor: "white",
  }

  const patientIcon = (color, isHovered) => ({
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: isHovered ? 8 : 5,
    fillColor: color,
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: "white",
  })

  const center = {
    lat: facility.loc_lat,
    lng: facility.loc_long
  }

  const patientColor = (patient) => {
    const percentage = patient.capabilityMatch?.percentage;
    if (percentage === undefined) return '#6b7280'; // Default gray
    if (percentage === 100) return '#10b981'; // green
    if (percentage > 0) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={9}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      <Marker 
        position={center} 
        title={facility.name} 
        icon={facilityIcon} 
        zIndex={10}
      />
      
      {patients.map(p => (
        <Marker
          key={p.id}
          position={{ lat: p.loc_lat, lng: p.loc_long }}
          title={p.name}
          icon={patientIcon(patientColor(p), hoveredPatient?.id === p.id)}
          zIndex={hoveredPatient?.id === p.id ? 20 : 5}
        />
      ))}
    </GoogleMap>
  )
}
