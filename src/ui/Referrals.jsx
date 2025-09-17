import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { facilities } from '../data/facilities.js'
import PatientDetailsComplete from './PatientDetailsComplete.jsx'
import { patients } from '../data/patientDetails.js'
import MapView from './MapView.jsx'
import { clinicalCapabilities } from '../data/ClinicalCapabilities.js'

function AssignModal({ open, onClose, patient }){
  const [hoveredFacility, setHoveredFacility] = useState(null)
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [directionsInfo, setDirectionsInfo] = useState({ distance: null, duration: null })
  const [searchTerm, setSearchTerm] = useState('')
  
  const capabilityDescriptionMap = useMemo(() => {
    const map = new Map();
    clinicalCapabilities.forEach(category => {
      category.nonAdmissibles.forEach(cap => {
        map.set(cap.key, cap.description);
      });
    });
    return map;
  }, []);

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

  const handleFacilitySelect = (facility) => {
    if (selectedFacility?.name === facility.name) {
      setSelectedFacility(null);
      setDirectionsInfo({ distance: null, duration: null });
    } else {
      setSelectedFacility(facility);
    }
  }

  const handleDirectionsResult = (directions) => {
    if (directions && directions.routes && directions.routes[0] && directions.routes[0].legs && directions.routes[0].legs[0]) {
      const leg = directions.routes[0].legs[0];
      setDirectionsInfo({
        distance: leg.distance.text,
        duration: leg.duration.text,
      });
    } else {
      setDirectionsInfo({ distance: null, duration: null });
    }
  }

  const facilitiesWithMatch = useMemo(() => {
    let facilitiesToShow = facilities.filter(f => f.name !== patient?.facility)
    if (searchTerm) {
      facilitiesToShow = facilitiesToShow.filter(
        f =>
          f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.streetaddress.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return facilitiesToShow
      .map(f => ({
        ...f,
        capabilityMatch: getCapabilityMatch(patient?.needs, f.capabilities)
      }))
      .sort((a, b) => b.capabilityMatch.percentage - a.capabilityMatch.percentage)
  }, [patient, searchTerm])

  if(!open || !patient) return null

  const handleAssign = () => {
    if (!selectedFacility) {
      toast.error("Please select a facility.")
      return
    }
    toast.success(`Patient ${patient.name} assigned to ${selectedFacility.name}.`)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-assign open" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h3>Assign or Transfer {patient.name}</h3>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">
          <div className="assign-content">
            <div className="referrals-list">
              <h4 style={{margin:'0 0 16px 0', fontSize:16}}>Healthcare Facilities</h4>
              <div className="search-container" style={{marginBottom: '16px'}}>
                <input
                  type="text"
                  placeholder="Search by name or address..."
                  className="search-input"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="scrollable-list">
                {facilitiesWithMatch.map((f)=> {
                  const { capabilityMatch } = f
                  let matchColor = 'red'
                  if (capabilityMatch.percentage === 100) {
                    matchColor = 'green'
                  } else if (capabilityMatch.percentage > 0) {
                    matchColor = 'yellow'
                  }

                  return (
                    <div 
                      key={f.name} 
                      className={`referral-item facility-item ${hoveredFacility?.name === f.name ? 'highlighted' : ''} ${selectedFacility?.name === f.name ? 'selected' : ''}`}
                      onMouseEnter={() => setHoveredFacility(f)}
                      onMouseLeave={() => setHoveredFacility(null)}
                      onClick={() => handleFacilitySelect(f)}
                    >
                      <div className="referral-info">
                        <div className="referral-name">{f.name}</div>
                        <div className="referral-details">
                          <span>{f.streetaddress}</span>
                        </div>
                        <div className="capability-match">
                          <div className={`capability-match-icon ${matchColor}`}></div>
                          <span>
                            Capabilities: {capabilityMatch.met} of {capabilityMatch.total} met
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
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="map-container">
              <h4 style={{margin:'0 0 16px 0', fontSize:16}}>Location Map</h4>
              {/* Reminder: Make sure the "Directions API" is enabled in your Google Cloud Console for the API key to work. */}
              <div className="map-wrapper">
                <MapView
                  patient={patient}
                  facilities={facilitiesWithMatch}
                  hoveredFacility={hoveredFacility}
                  selectedFacility={selectedFacility}
                  onDirectionsResult={handleDirectionsResult}
                />
              </div>
              {patient && (
                <div className="map-info" style={{marginTop: '12px'}}>
                  <strong>Patient Address</strong>
                  <p>{patient.streetaddress}</p>
                  {directionsInfo.distance && (
                    <div style={{marginTop: '8px'}}>
                      <strong>Distance to Facility</strong>
                      <p>{directionsInfo.distance} ({directionsInfo.duration})</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button 
            className="btn primary" 
            onClick={handleAssign}
            disabled={!selectedFacility}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Referrals(){
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [patientToAssign, setPatientToAssign] = useState(null)

  const handlePatientClick = (patient) => {
    // Navigate to the referrals route with patient ID
    navigate(`/referrals/${patient.id || patient.mrn || 'default'}`)
  }

  const handleOpenAssignModal = (patient) => {
    setPatientToAssign(patient)
    setOpen(true)
  }

  return (
    <div>
      <h2 style={{margin:'0 0 12px 0'}}>Referrals</h2>
      <div className="card pad">
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', fontSize:16, borderCollapse:'collapse'}}>
            <thead>
              <tr style={{textTransform:'uppercase', fontSize:14, color:'#374151', background:'#f8fafc'}}>
                {['Patient Name','Status','Clinware Rating','Facility Name','Daily Profit','Admissible','Processed Date','Actions'].map((h,i)=> (
                  <th key={i} style={{padding:'12px 16px', textAlign:'left'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map((r, i)=> (
                <tr key={i} style={{borderTop:'1px solid #e5e7eb'}}>
                  <td style={{padding:'12px 16px', fontWeight:600, color:'#1f2937'}}>
                    <button 
                      className="btn" 
                      style={{padding:0, border:'none', background:'transparent', color:'#095d7e', cursor: 'pointer'}}
                      onClick={() => handlePatientClick(r)}
                    > 
                      {r.name} 
                    </button>
                  </td>
                  <td style={{padding:'12px 16px'}}>{r.status}</td>
                  <td style={{padding:'12px 16px'}}>{r.rating}</td>
                  <td style={{padding:'12px 16px'}}>{r.facility}</td>
                  <td style={{padding:'12px 16px', color:'#127b43', fontWeight:600}}>{r.profit}</td>
                  <td style={{padding:'12px 16px'}}>{r.admissible}</td>
                  <td style={{padding:'12px 16px'}}>{r.date}</td>
                  <td style={{padding:'12px 16px'}}>
                    {r.actions.includes('Assign') && <button className="btn primary" onClick={()=>handleOpenAssignModal(r)}>Assign</button>}
                    {r.actions.includes('Transfer') && <button className="btn primary" onClick={()=>handleOpenAssignModal(r)} style={{marginRight:8}}>Transfer</button>}
                    {r.actions.includes('…') && <button className="btn">…</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AssignModal open={open} onClose={()=>setOpen(false)} patient={patientToAssign} />
    </div>
  )
}

