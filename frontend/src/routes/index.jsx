import { Routes, Route, Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import rootStore from '../stores/rootStore'
import Layout from '../components/layout/Layout'
import AuthLayout from '../components/layout/AuthLayout'

// Public pages
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import NotFound from '../pages/NotFound'

const ProtectedRoute = ({ children, admin = false }) => {
  const { isAuthenticated, isAdmin } = rootStore.authStore

  if (!isAuthenticated) {
    return <Navigate to='/login' />
  }

  if (admin && !isAdmin) {
    return <Navigate to='/' />
  }

  return children
}

const AppRoutes = observer(() => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<AuthLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>
          <Route path='/not-found' element={<NotFound />} />

        <Route path='/' element={<Home />} />
      </Route>

      <Route path='*' element={<Navigate to='/not-found' replace />} />
    </Routes>
  )
})

export default AppRoutes
