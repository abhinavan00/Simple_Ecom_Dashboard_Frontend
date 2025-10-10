import React from 'react'
import { BrowserRouter as Router , Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
        <Routes>
          {/* The main route will be the Dashboard (Protected inside the component) */}
          <Route path='/' element={<Dashboard />} />

          {/* Authentication Route */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* Optional: Redirect any unknown path to the dashboard or login */}
          <Route path='*' element={<Navigate to='/' /> } /> 
        </Routes>
    </Router>
  )
}

export default App
