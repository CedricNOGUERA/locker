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
import UpdatePassword from './pages/UpdatePassword/UpdatePassword'
import History from './pages/History/History'
import HistoryClient from './pages/Public/HistoryClient'
import Test from './pages/Public/Test'
import ReturnOrder from './pages/ReturnOrder'
import Test2 from './pages/Public/Test_copy'
import Prepared from './pages/Prepared'
import InDelivery from './pages/InDelivery'
import Home from './pages/Home'
// import InDelivery from './pages/InDelivery'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
     
      {
        path: 'preparations',
        element: (
          <React.Fragment>
            <HeaderDesign title='Préparations' />
            <Prepared />
          </React.Fragment>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <React.Fragment>
            <HeaderDesign title='Tableau de bord' />
            <DashBoard />
          </React.Fragment>
        ),
      },
      {
        path: 'livraisons',
        element: (
          <React.Fragment>
            <HeaderDesign title='Livraisons' />
            <InDelivery />
            {/* <InProgress /> */}
          </React.Fragment>
        ),
      },
      {
        path: 'testx',
        element: (
          <React.Fragment>
            <HeaderDesign title='test' />
            {/* <InDelivery /> */}
            <InProgress />
          </React.Fragment>
        ),
      },
      {
        path: 'deposees',
        element: (
          <React.Fragment>
            <HeaderDesign title='Commandes créées' />
            <Delivered />
          </React.Fragment>
        ),
      },
      {
        path: 'retraits',
        element: (
          <React.Fragment>
            <HeaderDesign title='A récupérer' />
            <ToRetrieve />
          </React.Fragment>
        ),
      },
      {
        path: 'nouvelle-commande',
        element: (
          <React.Fragment>
            <HeaderDesign title='Nouvelle commande' />
            <NewOrder />
            {/* <CreateOrder /> */}
          </React.Fragment>
        ),
      },
      {
        path: 'retour',
        element: (
          <React.Fragment>
            <HeaderDesign title='Commande à retourner' />
            <ReturnOrder />
            {/* <CreateOrder /> */}
          </React.Fragment>
        ),
      },
      {
        path: 'historique',
        element: (
          <React.Fragment>
            <HeaderDesign title='Historique' />
            <History />
          </React.Fragment>
        ),
      },
      {
        path: 'map',
        element: (
          <React.Fragment>
            <HeaderDesign title='Mapping' />
            <Map />
          </React.Fragment>
        ),
      },
      {
        path: 'update-password',
        element: (
          <React.Fragment>
            <HeaderDesign title='Mot de passe' />
            <UpdatePassword />
          </React.Fragment>
        ),
      },
    ],
  },
  {
    path: '/accueil',
    element: (
     
        
        <Home />
      
    ),
  },
  {
    path: '/connexion',
    element: <Auth />,
  },
  {
    path: '/forgot-password/:token',
    element: <Forgot />,
  },
  {
    path: '/commande/:id',
    element: <HistoryClient />,
  },
  {
    path: '/test',
    element: <Test />,
  },
  {
    path: '/test2',
    element: <Test2 />,
  },
  // 
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
