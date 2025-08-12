import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </>
  )
}