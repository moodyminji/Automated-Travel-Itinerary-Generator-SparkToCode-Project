import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import TripInput from './pages/TripInput'
import Itinerary from './pages/Itinerary'
import ItineraryEditor from './pages/ItineraryEditor'
import Budget from './pages/Budget'
import Notifications from './pages/Notifications'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'profile', element: <Profile /> },
      { path: 'trip', element: <TripInput /> },
      { path: 'itinerary', element: <Itinerary /> },
      { path: 'itinerary/edit', element: <ItineraryEditor /> },
      { path: 'budget', element: <Budget /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'admin', element: <Admin /> },
      { path: '*', element: <NotFound /> }
    ],
  },
])