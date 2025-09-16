import { useState, useMemo, useEffect } from 'react'
import { toast } from 'react-toastify';
import { facilities } from '../data/facilities.js'
import { patients } from '../data/patientDetails.js'
import MapView from './MapView.jsx'
import { clinicalCapabilities } from '../data/ClinicalCapabilities.js'

function AssignReferralsModal({ open, onClose, facility }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [hoveredPatient, setHoveredPatient] = useState(null)
  const [selectedPatients, setSelectedPatients] = useState(new Set())
  const [distances, setDistances] = useState({})

  useEffect(() => {
    if (!open) {
      setSelectedPatients(new Set())
      setDistances({})
    }
  }, [open])

  const capabilityDescriptionMap = useMemo(() => {
    const map = new Map();
    clinicalCapabilities.forEach(category => {
      category.nonAdmissibles.forEach(cap => {
        map.set(cap.key, cap.description);
      });
    });
    return map;
  }, []);

  const availablePatients = useMemo(() => {
    return patients.filter(p => p.facility === '--')
  }, [])

  const filteredPatients = useMemo(() => {
    if (!searchTerm) {
      return availablePatients
    }
    return availablePatients.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.streetaddress.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, availablePatients])

  const getCapabilityMatch = (patientNeeds, facilityCapabilities) => {
    if (!patientNeeds || !facilityCapabilities) {
      const needs = patientNeeds || []
      return { met: 0, total: needs.length, percentage: 0, metNeeds: [], unmetNeeds: needs }
    }
    const metNeeds = patientNeeds.filter(need => facilityCapabilities.includes(need))
    const unmetNeeds = patientNeeds.filter(need => !facilityCapabilities.includes(need))
    const percentage = patientNeeds.length > 0 ? (metNeeds.length / patientNeeds.length) * 100 : 100
    return { met: metNeeds.length, total: patientNeeds.length, percentage, metNeeds, unmetNeeds }
  }

  const getDistance = (lat1, lon1, lat2, lon2) => {
    // A simple approximation for distance
    const dx = lat1 - lat2
    const dy = lon1 - lon2
    return Math.sqrt(dx * dx + dy * dy)
  }

  const sortedPatients = useMemo(() => {
    const patientList = filteredPatients.map(p => ({
      ...p,
      capabilityMatch: getCapabilityMatch(p.needs, facility?.capabilities),
    }));

    if (!facility) return patientList

    return patientList
      .map(p => ({
        ...p,
        distance: getDistance(facility.loc_lat, facility.loc_long, p.loc_lat, p.loc_long)
      }))
      .sort((a, b) => a.distance - b.distance)
  }, [filteredPatients, facility])

  const getDistanceCategory = (patient) => {
    const distances = sortedPatients.map(p => p.distance);
    const maxDistance = Math.max(...distances);
    const percentile = patient.distance / maxDistance;

    if (percentile < 0.33) return 'green';
    if (percentile < 0.66) return 'yellow';
    return 'gray';
  }

  if (!open) return null

  const handlePatientSelect = (patientId) => {
    setSelectedPatients(prevSelected => {
      const newSelected = new Set(prevSelected)
      if (newSelected.has(patientId)) {
        newSelected.delete(patientId)
      } else {
        newSelected.add(patientId)
        const patient = sortedPatients.find(p => p.id === patientId)
        if (patient && facility && !distances[patientId] && window.google) {
          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route(
            {
              origin: { lat: patient.loc_lat, lng: patient.loc_long },
              destination: { lat: facility.loc_lat, lng: facility.loc_long },
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                const leg = result.routes[0].legs[0];
                setDistances(prevDistances => ({
                  ...prevDistances,
                  [patientId]: {
                    distance: leg.distance.text,
                    duration: leg.duration.text,
                  }
                }));
              } else {
                console.error(`Error fetching directions: ${status}`);
              }
            }
          );
        }
      }
      return newSelected
    })
  }

  const handleAssignSelected = () => {
    if (selectedPatients.size === 0) {
      toast.error("Please select at least one patient to assign.")
      return
    }

    const selectedPatientNames = sortedPatients
      .filter(p => selectedPatients.has(p.id))
      .map(p => p.name)
      .join(', ')

    toast.success(`${selectedPatientNames} assigned successfully to ${facility.name}.`)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-assign open" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Assign the following referrals to this facility</h3>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">
          <div className="assign-content">
            <div className="referrals-list">
              <h4 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Available Referrals</h4>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by name or address..."
                  className="search-input"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="scrollable-list">
                {sortedPatients.map((patient) => {
                  const { capabilityMatch } = patient
                  let matchColor = 'red'
                  if (capabilityMatch.percentage === 100) {
                    matchColor = 'green'
                  } else if (capabilityMatch.percentage > 0) {
                    matchColor = 'yellow'
                  }

                  return (
                    <div
                      key={patient.id}
                      className="referral-item"
                      onMouseEnter={() => setHoveredPatient(patient)}
                      onMouseLeave={() => setHoveredPatient(null)}
                    >
                      <input 
                        type="checkbox"
                        checked={selectedPatients.has(patient.id)}
                        onChange={() => handlePatientSelect(patient.id)}
                      />
                      <div className="referral-info">
                        <div className="referral-name">{patient.name}</div>
                        <div className="referral-address" style={{ fontSize: '11px', color: '#888', marginTop: '2px', lineHeight: '1.2' }}>
                          {patient.streetaddress}
                        </div>
                        {selectedPatients.has(patient.id) && distances[patient.id] && (
                          <div className="referral-details" style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>
                            📍 {distances[patient.id].distance} ({distances[patient.id].duration})
                          </div>
                        )}
                        <div className="referral-details" style={{ fontSize: '11px', marginTop: '3px' }}>
                          <span>{patient.status}</span> • <span>{patient.rating}</span> • <span className="profit">{patient.profit}</span>
                        </div>
                        <div className="capability-match" style={{ marginTop: '4px' }}>
                          <div className={`capability-match-icon ${matchColor}`}></div>
                          <span style={{ fontSize: '11px' }}>
                            Capabilities: {capabilityMatch.met}/{capabilityMatch.total}
                          </span>
                          <div className="capability-popover">
                            {capabilityMatch.metNeeds.length > 0 && (
                              <>
                                <h5>Met Needs</h5>
                                <ul>
                                  {capabilityMatch.metNeeds.map(need => (
                                    <li key={need} className="met">{capabilityDescriptionMap.get(need)}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                            {capabilityMatch.unmetNeeds.length > 0 && (
                              <>
                                <h5 style={{ marginTop: capabilityMatch.metNeeds.length > 0 ? '8px' : '0' }}>Unmet Needs</h5>
                                <ul>
                                  {capabilityMatch.unmetNeeds.map(need => (
                                    <li key={need} className="unmet">{capabilityDescriptionMap.get(need)}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="btn primary">Assign</button>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="map-container">
              <h4 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Location</h4>
              <div className="map-wrapper">
                <MapView 
                  facility={facility} 
                  patients={sortedPatients} 
                  hoveredPatient={hoveredPatient}
                  onDirectionsResult={() => {}} // Placeholder to prevent crash
                />
              </div>
              {facility && (
                <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
                  <strong>Facility Address</strong>
                  <p style={{ margin: '4px 0 0' }}>{facility.streetaddress}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button 
            className="btn primary"
            onClick={handleAssignSelected}
            disabled={selectedPatients.size === 0}
          >
            Assign Selected ({selectedPatients.size})
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Facilities() {
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState(null)

  const handleAssignClick = (facility) => {
    setSelectedFacility(facility)
    setAssignModalOpen(true)
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 12px 0' }}>Facilities</h2>
      <div className="facilities-grid">
        {/* Add Facility Card */}
        <article className="card pad add-facility-card">
          <div className="add-facility-content">
            <div className="plus-icon">+</div>
            <h3>Add Facility</h3>
          </div>
        </article>
        
        {/* Existing Facilities */}
        {facilities.map((f, idx) => (
          <article className="card pad facility-card" key={idx}>
            <h3 className="facility-name" onClick={() => {}}>{f.name}</h3>
            <p className="facility-address">{f.streetaddress}</p>
            <p className="facility-phone">Phone: {f.phone}</p>
            <div className="facility-actions">
              <button className="btn">Details</button>
              <button 
                className="btn primary"
                onClick={() => handleAssignClick(f)}
              >
                Assign Referrals
              </button>
            </div>
          </article>
        ))}
      </div>
      
      <AssignReferralsModal 
        open={assignModalOpen} 
        onClose={() => setAssignModalOpen(false)}
        facility={selectedFacility}
      />
    </div>
  )
}

