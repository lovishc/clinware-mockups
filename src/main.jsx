import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles.css'
import RootLayout from './ui/RootLayout.jsx'
import Facilities from './ui/Facilities.jsx'
import Referrals from './ui/Referrals.jsx'
import Analytics from './ui/Analytics.jsx'
import Admin from './ui/Admin.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Referrals /> },
      { path: 'facilities', element: <Facilities /> },
      { path: 'referrals', element: <Referrals /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'admin', element: <Admin /> }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
