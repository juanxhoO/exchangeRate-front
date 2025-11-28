import './App.css'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/auth-context'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'
import Providers from './pages/Providers'
import Subscribers from './pages/Subscribers'
import CreateProvider from './pages/Providers/CreateProvider'
import CreateSubscriber from './pages/Subscribers/CreateSubscriber'
import Reset from './pages/auth/Reset'
import { PrivateRoute } from './components/Providers/ProtectedRoute'
import Forgot from './pages/auth/Forgot'
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes with Dashboard Layout (Sidebar + Header + Footer) */}
        <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          {/* Add more dashboard routes here */}
          <Route path="/providers" element={<Providers />}>
            <Route path="create" element={<CreateProvider />} />
          </Route>
          <Route path="/subscribers" element={<Subscribers />}>
            <Route path="create" element={<CreateSubscriber />} />
          </Route>
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Route>

        {/* Routes with Auth Layout (No Sidebar/Header/Footer) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/forgot" element={<Forgot />} />

          {/* Add more auth routes here */}
          {/* <Route path="/register" element={<Register />} /> */}
          {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
