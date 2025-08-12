import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto flex items-center justify-between p-3">
        <Link to="/" className="font-semibold">Travel Planner</Link>
        <div className="flex gap-4 text-sm">
          <Link to="/trip" className="hover:underline">Plan Trip</Link>
          <Link to="/itinerary" className="hover:underline">Itinerary</Link>
          <Link to="/budget" className="hover:underline">Budget</Link>
          <Link to="/notifications" className="hover:underline">Notifications</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
          <Link to="/admin" className="hover:underline">Admin</Link>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/signup" className="hover:underline">Signup</Link>
        </div>
      </div>
    </nav>
  )
}