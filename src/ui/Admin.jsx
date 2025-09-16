import { useState, useEffect } from 'react'
import React from 'react';
import { toast } from 'react-toastify';

function DMEVendorModal({ open, onClose, mode, vendor, onSave, onRemove }){
  const [formData, setFormData] = useState({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectSuccess, setConnectSuccess] = useState(false);

  useEffect(() => {
    setFormData(vendor || { name: '', apiEndpoint: '', clientId: '', clientSecret: '' });
    setConnectSuccess(false);
    setIsConnecting(false);
  }, [open, vendor]);

  if(!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave({ ...vendor, ...formData });
    onClose();
  };
  
  const handleConnectAndSave = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setConnectSuccess(true);
      setTimeout(() => {
        onSave({ ...vendor, ...formData, status: 'Connected' });
        toast.success(`Vendor '${formData.name}' connected successfully.`);
        onClose();
      }, 1000);
    }, 1500);
  };

  const handleRemove = () => {
    onRemove(vendor.id);
    toast.success(`Vendor '${vendor.name}' has been removed.`);
    onClose();
  };

  const isConnectDisabled = !formData.name || !formData.apiEndpoint || !formData.clientId || !formData.clientSecret;

  const title = {
    add: 'Add New Vendor',
    connect: `Connect to ${vendor?.name}`,
    settings: `Settings for ${vendor?.name}`
  }[mode];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal open" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body" style={{ display: 'block' }}>
          <div className="form-grid">
            <label>Vendor Name</label>
            <input name="name" type="text" value={formData.name || ''} onChange={handleChange} className="card pad" style={{border:'1px solid #e5e7eb'}} placeholder="e.g., Reliable DME Solutions"/>
            <label>API Endpoint</label>
            <input name="apiEndpoint" type="text" value={formData.apiEndpoint || ''} onChange={handleChange} className="card pad" style={{border:'1px solid #e5e7eb'}} placeholder="e.g., https://api.vendor.com/v1/costs"/>
            <label>Client ID</label>
            <input name="clientId" type="text" value={formData.clientId || ''} onChange={handleChange} className="card pad" style={{border:'1px solid #e5e7eb'}} placeholder="e.g., clnwr_prod_abc123"/>
            <label>Client Secret</label>
            <input name="clientSecret" type="password" value={formData.clientSecret || ''} onChange={handleChange} className="card pad" style={{border:'1px solid #e5e7eb'}} placeholder="e.g., ••••••••••••••••"/>
          </div>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {(mode === 'settings' || mode === 'connect') && <button className="btn danger" onClick={handleRemove}>Remove Vendor</button>}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {connectSuccess ? (
              <span className="status-connected">Connected successfully!</span>
            ) : isConnecting ? (
              <span>Connecting...</span>
            ) : (
              <>
                <button className="btn" onClick={onClose}>Cancel</button>
                {mode === 'settings' && <button className="btn" onClick={() => onSave({ ...vendor, ...formData, status: 'Disconnected' })}>Disconnect</button>}
                <button className="btn primary" onClick={handleSave}>Save</button>
                {vendor?.status !== 'Connected' && mode !== 'add' && <button className="btn" onClick={handleConnectAndSave} disabled={isConnectDisabled}>Connect</button>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DMERuleModal({ open, onClose, rule, onSave }) {
  const [costs, setCosts] = useState({});

  useEffect(() => {
    if (rule) {
      setCosts(rule.costs || {});
    }
  }, [rule]);

  if (!open) return null;

  const handleCostChange = (e) => {
    const { name, value } = e.target;
    setCosts(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave({ ...rule, costs });
    toast.success(`Rule '${rule.name}' saved successfully.`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal open" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Rule: {rule.name}</h3>
        </div>
        <div className="modal-body" style={{ display: 'block' }}>
          <p style={{margin:'0 0 16px' , color:'#4b5563'}}>Manually override costs below. These will be used if the vendor API is unavailable.</p>
          <div className="form-grid">
            {Object.entries(costs).map(([key, value]) => (
              <React.Fragment key={key}>
                <label style={{textTransform: 'capitalize'}}>{key.replace(/([A-Z])/g, ' $1')}</label>
                <div className="input-with-currency">
                  <span>$</span>
                  <input
                    name={key}
                    type="number"
                    value={value}
                    onChange={handleCostChange}
                    className="card pad"
                    style={{border:'1px solid #e5e7eb', width: '100%'}}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={handleSave}>Save Manual Costs</button>
        </div>
      </div>
    </div>
  );
}

function MapDataModal({ open, onClose, onSave }){
  const [medicine, setMedicine] = useState(localStorage.getItem('map_medicine')||'')
  const [cost, setCost] = useState(localStorage.getItem('map_cost')||'')
  const [ndc, setNdc] = useState(localStorage.getItem('map_ndc')||'')
  if(!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal open" onClick={e=>e.stopPropagation()}>
        <div className="modal-header"><h3>Column names of CSV or JSON</h3></div>
        <div className="modal-body" style={{ display: 'block' }}>
          <p style={{margin:'0 0 12px 0', color:'#4b5563'}}>Provide mappings so we can align your CSV columns or JSON fields with our medication data source.</p>
          <div className="form-grid">
            <label>Medicine Description</label>
            <input value={medicine} onChange={e=>setMedicine(e.target.value)} className="card pad" style={{border:'1px solid #e5e7eb'}} placeholder="e.g., med_description"/>
            <label>Cost per Unit</label>
            <input value={cost} onChange={e=>setCost(e.target.value)} className="card pad" style={{border:'1px solid #e5e7eb'}} placeholder="e.g., cost_per_unit"/>
            <label>NDC (optional)</label>
            <div>
              <input value={ndc} onChange={e=>setNdc(e.target.value)} className="card pad" style={{border:'1px solid #e5e7eb'}} placeholder="e.g., national_drug_code"/>
              <div style={{fontSize:12, color:'#6b7280', marginTop: '4px'}}>Optional. Use this to link more information to external sources.</div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={()=>{ localStorage.setItem('map_medicine', medicine); localStorage.setItem('map_cost', cost); localStorage.setItem('map_ndc', ndc); onSave(); onClose(); }}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default function Admin(){
  const [tab, setTab] = useState('users')
  const [open, setOpen] = useState(false)
  const [validated, setValidated] = useState(false)
  const [isDmeModalOpen, setIsDmeModalOpen] = useState(false)
  const [dmeModalMode, setDmeModalMode] = useState('add')
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isDmeSectionOpen, setIsDmeSectionOpen] = useState(true);
  const [isRulesSectionOpen, setIsRulesSectionOpen] = useState(true);
  const hasMap = Boolean(localStorage.getItem('map_medicine') || localStorage.getItem('map_cost') || localStorage.getItem('map_ndc'))
  
  const handleValidateConnection = () => {
    if (!hasMap) {
      toast.error("Please map data fields before validating the connection.");
      return;
    }
    setValidated(true);
    toast.success("Connection validated successfully.");
  };

  const [vendors, setVendors] = useState(() => {
    const savedVendors = localStorage.getItem('dmeVendors');
    return savedVendors ? JSON.parse(savedVendors) : [];
  });

  const [rules, setRules] = useState(() => {
    const savedRules = localStorage.getItem('dmeRules');
    return savedRules ? JSON.parse(savedRules) : [
      { id: 1, name: 'Bariatric Patient Equipment', description: 'For patients ≥400 pounds, automatically price bariatric bed, ClearLift, better mattress, large wheelchair.', costs: { bariatricBed: 300, bariatricPatientLift: 250, bariatricWheelchair: 150 } },
      { id: 2, name: 'Wound Care Equipment', description: 'For patients with active wounds, automatically price WoundVac equipment.', costs: { woundVac: 2000 } },
      { id: 3, name: 'Respiratory Equipment', description: 'For patients requiring CPAP/BiPAP, automatically price appropriate respiratory equipment.', costs: { cpapBipap: 100 } },
    ];
  });

  useEffect(() => {
    localStorage.setItem('dmeVendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('dmeRules', JSON.stringify(rules));
  }, [rules]);

  const handleOpenDmeModal = (mode, vendor = null) => {
    setDmeModalMode(mode);
    setSelectedVendor(vendor);
    setIsDmeModalOpen(true);
  }

  const handleOpenRuleModal = (rule) => {
    setSelectedRule(rule);
    setIsRuleModalOpen(true);
  };
  
  const handleSaveVendor = (vendorData) => {
    if (vendorData.id) {
      setVendors(vendors.map(v => v.id === vendorData.id ? vendorData : v));
    } else {
      setVendors([...vendors, { ...vendorData, id: Date.now(), status: 'Disconnected' }]);
    }
  };

  const handleRemoveVendor = (vendorId) => {
    setVendors(vendors.filter(v => v.id !== vendorId));
  };

  const handleSaveRule = (ruleData) => {
    setRules(rules.map(r => r.id === ruleData.id ? ruleData : r));
  };
  
  const tabs = [
    { key: 'users', label: 'Users' },
    { key: 'capabilities', label: 'Non Admissibles' },
    { key: 'adjustments', label: 'Adjustments' },
    { key: 'pharmacy', label: 'Pharmacy' },
    { key: 'integrations', label: 'Integrations' }
  ]

  return (
    <div>
      <h2 style={{margin:'0 0 24px 0'}}>Admin Panel</h2>
      <div className="admin-container">
        <div className="admin-tabs">
          {tabs.map(tabItem => (
            <button 
              key={tabItem.key} 
              className={`admin-tab ${tab === tabItem.key ? 'active' : ''}`}
              onClick={() => setTab(tabItem.key)}
            >
              {tabItem.label}
            </button>
          ))}
        </div>
        
        <div className="admin-content">
          {tab === 'users' && (
            <div className="tab-panel">
              <h3>User Management</h3>
              <div className="search-container">
                <input type="text" placeholder="Search by name or email..." className="search-input" />
              </div>
              <div className="user-list">
                <div className="user-item">
                  <div className="user-info">
                    <span className="user-name">John Doe</span>
                    <span className="user-email">john@example.com</span>
                  </div>
                  <span className="user-role">Admin</span>
                </div>
                <div className="user-item">
                  <div className="user-info">
                    <span className="user-name">Jane Smith</span>
                    <span className="user-email">jane@example.com</span>
                  </div>
                  <span className="user-role">User</span>
                </div>
              </div>
            </div>
          )}
          
          {tab === 'capabilities' && (
            <div className="tab-panel">
              <h3>Non Admissibles</h3>
              <p>Define clinical capabilities and non-admissible criteria here.</p>
            </div>
          )}
          
          {tab === 'adjustments' && (
            <div className="tab-panel">
              <h3>Adjustments</h3>
              <p>Configure system adjustments and settings here.</p>
            </div>
          )}
          
          {tab === 'integrations' && (
            <div className="tab-panel">
              <h3>Third Party Integrations</h3>
              <div className="integration-section">
                <div className="card">
                  <div className="accordion-header" onClick={() => setIsDmeSectionOpen(!isDmeSectionOpen)}>
                    <div>
                      <h4>Durable Medical Equipment (DME) Cost Integration</h4>
                      <p style={{margin: '4px 0 0 0', fontSize: '14px'}}>Manage connections to DME vendors and automated costing rules.</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`accordion-icon ${isDmeSectionOpen ? 'open' : ''}`} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>

                  <div className={`accordion-content ${isDmeSectionOpen ? 'open' : ''}`}>
                    <div style={{ marginTop: '20px' }}>
                      <h5>Vendor APIs</h5>
                      <p>Connect to multiple DME vendors for cost comparison.</p>
                      <div className="vendor-list">
                        {vendors.map(vendor => (
                          <div className="vendor-item" key={vendor.id}>
                            <div className="vendor-info">
                              <span>{vendor.name}</span>
                              <span className={vendor.status === 'Connected' ? 'status-connected' : 'status-disconnected'}>
                                {vendor.status}
                              </span>
                            </div>
                            <div className="vendor-actions" style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn" onClick={() => handleOpenDmeModal('settings', vendor)}>Edit</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="btn primary" onClick={() => handleOpenDmeModal('add')}>Add New Vendor</button>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                      <div className="accordion-header" onClick={() => setIsRulesSectionOpen(!isRulesSectionOpen)}>
                        <h5>Automated Costing Rules</h5>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`accordion-icon ${isRulesSectionOpen ? 'open' : ''}`} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className={`accordion-content ${isRulesSectionOpen ? 'open' : ''}`}>
                        <p>Define rules to automatically add DME costs based on patient data.</p>
                        <div className="rules-list">
                          {rules.map(rule => (
                            <div className="rule-item" key={rule.id}>
                              <div>
                                <strong>{rule.name}</strong>
                                <p>{rule.description}</p>
                              </div>
                              <button className="btn" onClick={() => handleOpenRuleModal(rule)}>Edit</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                      <h5>General Settings</h5>
                      <div className="setting-item">
                        <label>Support manual override of DME recommendations</label>
                        <input type="checkbox" defaultChecked/>
                      </div>
                      <div className="setting-item">
                        <label>Maintain DME cost history for trending analysis</label>
                         <button className="btn">View Report</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {tab === 'pharmacy' && (
            <div className="tab-panel">
              <div className="integration-section">
                <div className="card">
                  <h4>Pruitt Pharmacy API Integration</h4>
                  <p>Manage connection to Pruitt Pharmacy for real-time medication costs.</p>

                  <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5>API Configuration</h5>
                      {validated && (
                        <span className="status-connected" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" style={{width: 16, height: 16}} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Validated
                        </span>
                      )}
                    </div>
                    <div className="form-grid" style={{maxWidth: '500px', marginTop: '16px'}}>
                      <label>Source API URL</label>
                      <input className="card pad" style={{border:'1px solid #e5e7eb'}} placeholder="e.g., https://api.pruittpharmacy.com/v2/meds"/>
                      <label>Client ID</label>
                      <input className="card pad" style={{border:'1px solid #e5e7eb'}} placeholder="e.g., clinware_prod_xyz789"/>
                      <label>Client Secret</label>
                      <input type="password" className="card pad" style={{border:'1px solid #e5e7eb'}} placeholder="e.g., ••••••••••••••••"/>
                    </div>
                    <div style={{display:'flex', justifyContent:'flex-end', gap:8, alignItems: 'center', marginTop: '16px'}}>
                      <button className="btn primary" onClick={handleValidateConnection}>Validate Connection</button>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--gray-200)' }}>
                    <h5>Data Mapping</h5>
                    <p>Align your data fields with our medication data source.</p>
                    <button className="btn" onClick={()=>setOpen(true)}>Map Data Fields</button>
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--gray-200)' }}>
                    <h5>Advanced Settings</h5>
                    <div className="setting-item">
                      <label>Fallback to Medicare costs if API is unavailable</label>
                      <input type="checkbox" defaultChecked/>
                    </div>
                    <div className="setting-item">
                      <label>Log all pharmacy API interactions for audit purposes</label>
                      <button className="btn">View API Logs</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <MapDataModal open={open} onClose={()=>setOpen(false)} onSave={()=>{}} />
      <DMEVendorModal 
        open={isDmeModalOpen} 
        onClose={() => setIsDmeModalOpen(false)} 
        mode={dmeModalMode}
        vendor={selectedVendor}
        onSave={handleSaveVendor}
        onRemove={handleRemoveVendor}
      />
      <DMERuleModal
        open={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        rule={selectedRule}
        onSave={handleSaveRule}
      />
    </div>
  )
}

