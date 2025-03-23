import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import rootStore from '../stores/rootStore'
import Layout from '../components/layout/Layout'
import AuthLayout from '../components/layout/AuthLayout'
import EditProfile from '../pages/profile/EditProfile'
import { useStore } from '@/stores/rootStore'
import { Center, Spinner } from '@chakra-ui/react'
import { useEffect } from 'react'

// Public pages
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Contact from '../pages/Contact'
import About from '../pages/About'
import NotFound from '../pages/NotFound'

const ProtectedRoute = ({ children, admin = false }) => {
  const {
    authStore: { isAuthenticated, isAdmin, loading }
  } = useStore()
  const location = useLocation()

  if (loading) {
    return (
      <Center h='100vh'>
        <Spinner size='xl' color='red.500' />
      </Center>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />
  }

  if (admin && !isAdmin) {
    return <Navigate to='/' replace />
  }

  return children
}

const AuthRoute = observer(({ children }) => {
  const { authStore } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (authStore.isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [authStore.isAuthenticated])

  // Nếu đang loading hoặc đã authenticated thì return null để không render gì cả
  if (authStore.loading || authStore.isAuthenticated) {
    return null
  }

  return children
})

const AppRoutes = observer(() => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<AuthLayout />}>
          <Route
            path='/login'
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path='/register'
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          />
        </Route>

        <Route path='/not-found' element={<NotFound />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
        <Route path='/' element={<Home />} />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path='*' element={<Navigate to='/not-found' replace />} />
    </Routes>
  )
})

export default AppRoutes
