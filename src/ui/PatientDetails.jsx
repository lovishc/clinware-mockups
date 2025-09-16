import { useState, useEffect } from 'react'

export default function PatientDetails({ patient = { name: 'Patient 3', mrn: '4208211', age: 73, gender: 'F' } }) {
  const [activeTab, setActiveTab] = useState('pdpm')
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const [cardVisibility, setCardVisibility] = useState({
    pdpm: true,
    diagnosis: true,
    medications: true,
    respiratory: true
  })

  const switchTab = (tabId) => {
    setActiveTab(tabId)
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(button => {
      button.classList.remove('tab-active')
      button.classList.add('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300')
    })
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'))
    
    // Add active class to selected tab
    const activeButton = document.getElementById(`tab-${tabId}`)
    if (activeButton) {
      activeButton.classList.add('tab-active')
      activeButton.classList.remove('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300')
    }
    const activeContent = document.getElementById(`content-${tabId}`)
    if (activeContent) {
      activeContent.classList.remove('hidden')
    }

    // Sync active state to corresponding summary card
    const keys = ['pdpm', 'diagnosis', 'medications', 'respiratory']
    keys.forEach(k => {
      const card = document.getElementById(`card-${k}`)
      if (card) card.classList.remove('active-linked')
    })
    const activeCard = document.getElementById(`card-${tabId}`)
    if (activeCard && !activeCard.classList.contains('hidden')) activeCard.classList.add('active-linked')
  }

  const toggleCard = (cardId) => {
    setCardVisibility(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
  }

  // Load initial preferences and setup
  useEffect(() => {
    // Set first visible card as active
    const visibleCards = Object.entries(cardVisibility).filter(([_, visible]) => visible)
    if (visibleCards.length > 0) {
      setActiveTab(visibleCards[0][0])
    }
  }, [cardVisibility])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800" style={{fontFamily: 'Inter, sans-serif'}}>
      {/* Hidden SVG definition for the half-star gradient */}
      <svg style={{width:0,height:0,position:'absolute'}} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="half-star-gradient">
            <stop offset="50%" stopColor="#ffcc17" />
            <stop offset="50%" stopColor="#c7c7c7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Persistent Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        {/* Patient ID & Alerts Bar */}
        <div id="patient-bar" className="container mx-auto px-4 sm:px-6 lg:px-8 sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center py-3">
            {/* Left: Patient Info */}
            <div className="md:col-span-1">
              <h1 className="text-lg font-bold text-gray-900">{patient.name}</h1>
              <p className="text-sm text-gray-500">MRN: {patient.mrn} | {patient.age} / {patient.gender}</p>
            </div>
            
            {/* Center: Clinware Rating */}
            <div id="clinware-rating" className="text-center order-first md:order-none col-span-2 md:col-span-1">
              <p className="text-sm font-medium text-gray-500 mb-1">Clinware Rating</p>
              <div className="flex justify-center items-center space-x-1">
                {/* Three Filled Stars */}
                <svg className="w-7 h-7" style={{color: '#ffcc17'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-7 h-7" style={{color: '#ffcc17'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-7 h-7" style={{color: '#ffcc17'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {/* Half Star */}
                <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="url(#half-star-gradient)">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {/* Empty Star */}
                <svg className="w-7 h-7" style={{color: '#c7c7c7'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700 mt-1">3.5/5</p>
            </div>

            {/* Right: Actions */}
            <div className="text-right">
              <div className="inline-flex items-center space-x-2">
                <button className="inline-flex items-center px-3 py-1.5 text-white rounded-md text-sm font-medium hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-indigo-500" style={{backgroundColor: '#095d7e'}}>
                  Accept
                </button>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500">
                  Deny
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Summary Overview Section */}
        <div id="summary-section" className="border-y border-gray-200" style={{backgroundColor: '#f2f2f2'}}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
            <div className="flex justify-end mb-2">
              <div className="relative">
                <button 
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => setCustomizeOpen(!customizeOpen)}
                >
                  Customize
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/>
                  </svg>
                </button>
                {customizeOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-md p-3 z-10">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Show cards</p>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center justify-between">
                        <span>PDPM Analysis</span>
                        <input type="checkbox" checked={cardVisibility.pdpm} onChange={() => toggleCard('pdpm')} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Diagnosis</span>
                        <input type="checkbox" checked={cardVisibility.diagnosis} onChange={() => toggleCard('diagnosis')} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Medications</span>
                        <input type="checkbox" checked={cardVisibility.medications} onChange={() => toggleCard('medications')} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Respiratory</span>
                        <input type="checkbox" checked={cardVisibility.respiratory} onChange={() => toggleCard('respiratory')} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {/* PDPM Analysis Summary Card */}
              {cardVisibility.pdpm && (
                <button 
                  id="card-pdpm" 
                  onClick={() => switchTab('pdpm')} 
                  className="p-4 rounded-lg border border-gray-200 shadow-sm text-left hover:shadow transition flex flex-col h-full card-linked"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.06), 0 2px 12px 0 rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(255, 255, 255, 0.05)',
                    position: 'relative'
                  }}
                >
                  <span className="card-bookmark" aria-hidden="true" style={{
                    position: 'absolute',
                    left: '-4px',
                    top: '16px',
                    width: '10px',
                    height: '26px',
                    background: '#095d7e',
                    borderTopRightRadius: '3px',
                    clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    zIndex: 5
                  }}></span>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">PDPM Analysis</h3>
                    <span className="inline-flex items-center text-sm font-semibold" style={{color: '#63993d'}}>
                      +29.5%
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h6.586L10.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L12.586 11H6a1 1 0 01-1-1z" clipRule="evenodd"/>
                      </svg>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Current: <span className="font-medium text-gray-800">$550.45</span> · Potential: <span className="font-medium text-gray-800">$712.80</span>
                  </p>
                  <div className="mt-3 w-full flex rounded-full overflow-hidden h-2" style={{backgroundColor: '#e0e0e0'}}>
                    <div style={{backgroundColor: '#095d7e', width: '60%'}}></div>
                    <div style={{backgroundColor: '#469c46', width: '40%'}}></div>
                  </div>
                  <div className="mt-3">
                    <div className="grid grid-cols-2 gap-6 items-center justify-items-center">
                      {/* Conservative mix donut */}
                      <svg className="h-20 w-20" viewBox="0 0 60 60" aria-hidden="true">
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                        {/* PT */}
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#4394e5" strokeWidth="8" strokeLinecap="butt" transform="rotate(-90 30 30)" strokeDasharray="16.4 96.7" strokeDashoffset="0" />
                        {/* OT */}
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#095d7e" strokeWidth="8" strokeLinecap="butt" transform="rotate(-90 30 30)" strokeDasharray="15.38 97.72" strokeDashoffset="-16.4" />
                        {/* SLP */}
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#63bdbd" strokeWidth="8" strokeLinecap="butt" transform="rotate(-90 30 30)" strokeDasharray="10.29 102.81" strokeDashoffset="-31.78" />
                        {/* Nursing */}
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#14967f" strokeWidth="8" strokeLinecap="butt" transform="rotate(-90 30 30)" strokeDasharray="24.65 88.45" strokeDashoffset="-42.07" />
                        {/* NTA */}
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#cc0000" strokeWidth="8" strokeLinecap="butt" transform="rotate(-90 30 30)" strokeDasharray="23.75 89.35" strokeDashoffset="-66.72" />
                        {/* Non-Case-Mix */}
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#707070" strokeWidth="8" strokeLinecap="butt" transform="rotate(-90 30 30)" strokeDasharray="22.62 90.48" strokeDashoffset="-90.47" />
                        <text x="30" y="33" textAnchor="middle" fontSize="9" fill="#1f1f1f" fontWeight="700">Cons</text>
                      </svg>
                      {/* Potential mix donut */}
                      <svg className="h-20 w-20" viewBox="0 0 60 60" aria-hidden="true">
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                        {/* PT */}
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#4394e5" strokeWidth="8" strokeLinecap="butt" transform="rotate(-90 30 30)" strokeDasharray="18.8 94.3" strokeDashoffset="0" />
                        {/* OT */}
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#095d7e" strokeWidth="8" strokeLinecap="butt" transform="rotate(-90 30 30)" strokeDasharray="17.42 95.68" strokeDashoffset="-18.8" />
                        {/* SLP */}
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#63bdbd" strokeWidth="8" strokeLinecap="butt" transform="rotate(-90 30 30)" strokeDasharray="11.09 102.01" strokeDashoffset="-36.22" />
                        {/* Nursing */}
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#14967f" strokeWidth="8" strokeLinecap="butt" transform="rotate(-90 30 30)" strokeDasharray="23.75 89.35" strokeDashoffset="-47.31" />
                        {/* NTA */}
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#cc0000" strokeWidth="8" strokeLinecap="butt" transform="rotate(-90 30 30)" strokeDasharray="24.4 88.7" strokeDashoffset="-71.06" />
                        {/* Non-Case-Mix */}
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#707070" strokeWidth="8" strokeLinecap="butt" transform="rotate(-90 30 30)" strokeDasharray="17.42 95.68" strokeDashoffset="-95.46" />
                        <text x="30" y="33" textAnchor="middle" fontSize="9" fill="#1f1f1f" fontWeight="700">Pot</text>
                      </svg>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
                      <span className="inline-flex items-center"><span className="w-2 h-2 rounded-sm mr-1" style={{backgroundColor: '#4394e5'}}></span>PT</span>
                      <span className="inline-flex items-center"><span className="w-2 h-2 rounded-sm mr-1" style={{backgroundColor: '#095d7e'}}></span>OT</span>
                      <span className="inline-flex items-center"><span className="w-2 h-2 rounded-sm mr-1" style={{backgroundColor: '#63bdbd'}}></span>SLP</span>
                      <span className="inline-flex items-center"><span className="w-2 h-2 rounded-sm mr-1" style={{backgroundColor: '#14967f'}}></span>Nursing</span>
                      <span className="inline-flex items-center"><span className="w-2 h-2 rounded-sm mr-1" style={{backgroundColor: '#cc0000'}}></span>NTA</span>
                      <span className="inline-flex items-center"><span className="w-2 h-2 rounded-sm mr-1" style={{backgroundColor: '#707070'}}></span>NCM</span>
                    </div>
                  </div>
                </button>
              )}

              {/* Add other cards similarly... */}
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div id="tabs-container" className="border-b border-gray-200 sticky bg-white/90 backdrop-blur" style={{top: 'var(--tabs-top, 56px)', zIndex: 10}}>
        <nav className="-mb-px flex space-x-6 container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Tabs">
          {cardVisibility.pdpm && (
            <button 
              id="tab-pdpm" 
              onClick={() => switchTab('pdpm')} 
              className={`tab-btn whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'pdmp' ? 'tab-active' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              style={activeTab === 'pdpm' ? {borderBottomColor: '#095d7e', color: '#095d7e', fontWeight: 600} : {}}
            >
              <span className="inline-flex items-center">
                <span className="w-1.5 h-1.5 rounded-sm mr-2 tab-dot" style={{backgroundColor: '#095d7e'}}></span>
                PDPM Analysis
              </span>
            </button>
          )}
          {/* Add other tab buttons similarly... */}
        </nav>
      </div>

      {/* Tab Content Panels */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mt-6">
          {/* PDPM Analysis Panel */}
          <div id="content-pdpm" className={`tab-content space-y-8 ${activeTab !== 'pdpm' ? 'hidden' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Content from original HTML */}
              <div className="p-3 border border-gray-200 shadow-sm flex flex-col h-full border-l-4 border-gray-300" style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.06), 0 2px 12px 0 rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(255, 255, 255, 0.05)'
              }}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-800">Conservative</h3>
                  <span className="text-xs text-gray-500">Daily</span>
                </div>
                <div className="mt-1 h-3 bg-gray-200 rounded-full overflow-hidden flex">
                  <div className="h-3" style={{backgroundColor: '#bceba5', width: '75.5%'}}></div>
                  <div className="h-3" style={{backgroundColor: '#469c46', width: '24.5%'}}></div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center"><span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{backgroundColor: '#bceba5'}}></span>Cost $415.50 (75.5%)</span>
                    <span className="inline-flex items-center"><span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{backgroundColor: '#469c46'}}></span>Profit $134.95 (24.5%)</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-900">Total $550.45</span>
                </div>
              </div>
            </div>
          </div>

          {/* Other tab content panels */}
          <div id="content-diagnosis" className={`tab-content space-y-6 ${activeTab !== 'diagnosis' ? 'hidden' : ''}`}>
            <div className="space-y-6">
              <div className="border-l-4 shadow-sm" style={{
                borderLeftColor: '#095d7e',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.06), 0 2px 12px 0 rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(255, 255, 255, 0.05)'
              }}>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-3" style={{color: '#095d7e'}}>Primary Diagnosis</h3>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Acute delirium superimposed on presumed Rapidly progressive neurodegenerative condition</p>
                      <p className="text-xs text-gray-500 mt-1">ICD-10: <span className="font-semibold text-gray-600">B17.0</span> | Category: <span className="font-semibold text-gray-600">Acute Infections</span> | Confidence: <span className="font-semibold text-gray-600">60%</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add other content panels as needed */}
        </div>
      </main>
    </div>
  )
}
