import { Routes, Route, Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import rootStore from '../stores/rootStore'

// Public pages
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Layout from '../components/layout/Layout'

const ProtectedRoute = ({ children, admin = false }) => {
  const { isAuthenticated, isAdmin } = rootStore.authStore

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (admin && !isAdmin) {
    return <Navigate to="/" />
  }

  return children
}

const AppRoutes = observer(() => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
})

export default AppRoutes
