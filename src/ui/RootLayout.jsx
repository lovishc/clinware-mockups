import { NavLink, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import pruitthealthLogo from '../assets/pruitthealth-logo-no-tag.png'
import clinwareLogo from '../assets/clinware-logo-design-horizontal.svg'

function Masthead() {
  return (
    <header className="masthead">
      <div className="masthead-content">
        <div className="masthead-left">
          <img src={pruitthealthLogo} alt="PruittHealth" className="logo-main" />
        </div>
        <div className="masthead-right">
          <span className="powered-by-text">Powered By</span>
          <img src={clinwareLogo} alt="Clinware" className="logo-powered" />
        </div>
      </div>
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

