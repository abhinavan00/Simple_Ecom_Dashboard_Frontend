import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
