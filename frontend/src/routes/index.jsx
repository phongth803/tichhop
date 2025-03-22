import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
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

const AppRoutes = observer(() => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<AuthLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>
        <Route path='/not-found' element={<NotFound />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />

        <Route path='/' element={<Home />} />
        <Route
          path='/profile/edit'
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
