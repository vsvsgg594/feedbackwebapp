import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import FeedbackForm from './components/FeedbackForm'

import Home from './pages/Home'

import UserProfile from './components/Profile'
import Admin from './pages/Admin'


function App() {

  return (
    <>
      <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path='/admin-dashboard' element={<Admin/>}/>
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App
