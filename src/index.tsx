import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Auth from './pages/Public/Auth'
import 'animate.css'
import ToRetrieve from './pages/ToRetrieve'
import InProgress from './pages/InProgress'
import HeaderDesign from './components/layout/HeaderDesign'
import Delivered from './pages/Delivered'
import ScrollToTop from './components/ui/ScrollToTop'
import NewOrder from './pages/newOrder/NewOrder'
import Map from './pages/Map/Map'
import DashBoard from './pages/DashBoard'
import Forgot from './pages/Public/Forgot'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'dashboard',
        element: (
          <React.Fragment>
            <HeaderDesign title='Tableau de bord' icon='ri-pie-chart-2-fill' />
            <DashBoard />
          </React.Fragment>
        ),
      },
      {
        path: 'in-progress',
        element: (
          <React.Fragment>
            <HeaderDesign title='A livrer' icon='ri-file-list-line' />
            <InProgress />
          </React.Fragment>
        ),
      },
      {
        path: 'orders-delivered',
        element: (
          <React.Fragment>
            <HeaderDesign title='Livraisons déposées' icon='' />
            <Delivered />
          </React.Fragment>
        ),
      },
      {
        path: 'orders-to-retrieve',
        element: (
          <React.Fragment>
            <HeaderDesign title='A récupérer' icon='ri-inbox-unarchive-line' />
            <ToRetrieve />
          </React.Fragment>
        ),
      },
      {
        path: 'nouvelle-commande',
        element: (
          <React.Fragment>
            <HeaderDesign title='Nouvelle commande' icon='ri-file-add-line' />
            <NewOrder />
          </React.Fragment>
        ),
      },
      {
        path: 'map',
        element: (
          <React.Fragment>
            <HeaderDesign title='Mapping' icon='' />
            <Map />
          </React.Fragment>
        ),
      },
    ],
  },
  {
    path: '/connexion',
    element: <Auth />,
  },
  {
    path: '/forgot-pass/:token',
    element: <Forgot />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ScrollToTop />
  </React.StrictMode>
)
serviceWorkerRegistration.register()
reportWebVitals()
