import { NavLink, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import clinwareLogo from '../assets/clinware-logo-design-horizontal.svg'

function Masthead() {
  return (
    <header className="masthead">
      <div className="masthead-content">
        <div className="masthead-left">
          <img src={clinwareLogo} alt="Clinware" className="logo-main" />
        </div>
        <div className="masthead-right">
          <div className="demo-badge">
            <div className="demo-badge-inner">
              <span className="demo-icon">🚧</span>
              <span className="demo-text">DEMO</span>
              <div className="demo-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .masthead-right {
          display: flex;
          align-items: center;
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
        </aside>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

