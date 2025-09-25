import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import clinwareLogo from '../assets/clinware-logo-design-horizontal.svg'

function Masthead() {
  const [customLogo, setCustomLogo] = useState(null)

  // Load custom logo from localStorage on component mount
  useEffect(() => {
    const savedLogo = localStorage.getItem('customLogo')
    if (savedLogo) {
      setCustomLogo(savedLogo)
    }
  }, [])

  return (
    <header className="masthead">
      <div className="masthead-content">
        <div className="masthead-left">
          {customLogo ? (
            <img src={customLogo} alt="Custom Logo" className="logo-main custom-logo" />
          ) : (
            <img src={clinwareLogo} alt="Clinware" className="logo-main" />
          )}
        </div>
        
        <div className="masthead-right">
          {customLogo ? (
            <div className="powered-by-section">
              <span className="powered-by-text">Powered By</span>
              <img src={clinwareLogo} alt="Clinware" className="logo-powered" />
            </div>
          ) : null}
        
        </div>
      </div>
      <style jsx>{`
        .masthead-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .custom-logo, .logo-main {
          max-height: 60px;
          width: auto;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
          image-rendering: high-quality;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        .powered-by-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .powered-by-text {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }
        
        .logo-powered {
          height: 50px;
          width: auto;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
          image-rendering: high-quality;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        .demo-badge {
          position: relative;
          background: linear-gradient(135deg, #8b9dc3, #a8b5d1);
          padding: 8px 16px;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(139, 157, 195, 0.25);
          border: 2px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          animation: demo-glow 2s ease-in-out infinite alternate;
        }
        
        .demo-badge-inner {
          display: flex;
          align-items: center;
          gap: 6px;
          position: relative;
          z-index: 2;
        }
        
        .demo-icon {
          font-size: 14px;
          animation: demo-bounce 1.5s ease-in-out infinite;
        }
        
        .demo-text {
          color: white;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 1px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .demo-pulse {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 22px;
          background: linear-gradient(135deg, #8b9dc3, #a8b5d1);
          opacity: 0.6;
          animation: demo-pulse 2s ease-in-out infinite;
          z-index: 1;
        }
        
        @keyframes demo-glow {
          0% {
            box-shadow: 0 4px 15px rgba(139, 157, 195, 0.25);
          }
          100% {
            box-shadow: 0 6px 20px rgba(139, 157, 195, 0.35);
          }
        }
        
        @keyframes demo-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        
        @keyframes demo-pulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.3;
          }
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
        }
      `}</style>
    </header>
  )
}

function LogoUploadSection() {
  const [customLogo, setCustomLogo] = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const fileInputRef = useRef(null)

  // Load custom logo from localStorage on component mount
  useEffect(() => {
    const savedLogo = localStorage.getItem('customLogo')
    if (savedLogo) {
      setCustomLogo(savedLogo)
    }
  }, [])

  const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const logoData = e.target.result
        setCustomLogo(logoData)
        localStorage.setItem('customLogo', logoData)
        setShowUpload(false)
        // Trigger a page refresh to update the masthead
        window.location.reload()
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveLogo = () => {
    setCustomLogo(null)
    localStorage.removeItem('customLogo')
    setShowUpload(false)
    // Trigger a page refresh to update the masthead
    window.location.reload()
  }

  const handleMouseEnter = () => {
    setShowUpload(true)
  }

  const handleMouseLeave = () => {
    setShowUpload(false)
  }

  return (
    <div 
      className="logo-upload-section"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="upload-trigger" onClick={() => setShowUpload(!showUpload)}>
        <svg 
          className={`caret-icon ${showUpload ? 'rotated' : ''}`}
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <path 
            d="M7 10l5 5 5-5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      <div className={`upload-panel ${showUpload ? 'visible' : ''}`}>
        <button onClick={handleUploadClick} className="upload-btn">
          📁 Upload Logo
        </button>
        {customLogo && (
          <button onClick={handleRemoveLogo} className="remove-btn">
            🗑️ Remove Logo
          </button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        style={{ display: 'none' }}
      />
      
      <style jsx>{`
        .logo-upload-section {
          position: relative;
          margin-top: auto;
          padding: 0;
        }
        
        .upload-trigger {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 32px;
          cursor: pointer;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
          transition: all 0.2s ease;
        }
        
        .upload-trigger:hover {
          background: #f3f4f6;
        }
        
        .caret-icon {
          color: #9ca3af;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        
        .caret-icon.rotated {
          transform: rotate(180deg);
          color: #6b7280;
        }
        
        .upload-panel {
          position: absolute;
          bottom: 32px;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
          transform: translateY(100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
        }
        
        .upload-panel.visible {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }
        
        .upload-btn, .remove-btn {
          display: block;
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: none;
          font-size: 14px;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.2s;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .upload-btn:last-child, .remove-btn:last-child {
          border-bottom: none;
        }
        
        .upload-btn:hover {
          background-color: #f9fafb;
        }
        
        .remove-btn {
          color: #dc2626;
        }
        
        .remove-btn:hover {
          background-color: #fef2f2;
        }
      `}</style>
    </div>
  )
}

export default function RootLayout(){
  return (
    <div className="app-layout">
      <Masthead />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="content-wrapper">
        <aside className="sidebar">
          <nav className="nav">
            <NavLink to="/facilities" className={({isActive})=> isActive? 'active' : undefined}>Facilities</NavLink>
            <NavLink to="/referrals" className={({isActive})=> isActive? 'active' : undefined}>Referrals</NavLink>
            <NavLink to="/analytics" className={({isActive})=> isActive? 'active' : undefined}>Analytics</NavLink>
            <NavLink to="/admin" className={({isActive})=> isActive? 'active' : undefined}>Admin</NavLink>
          </nav>
          <LogoUploadSection />
        </aside>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

