import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import Layout from '../components/layout/Layout'
import AuthLayout from '../components/layout/AuthLayout'
import EditProfile from '../pages/profile/EditProfile'
import { useStore } from '@/stores/rootStore'
import { useEffect } from 'react'
import MyOrders from '../pages/MyOrders'

// Public pages
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Contact from '../pages/Contact'
import About from '../pages/About'
import NotFound from '../pages/NotFound'
import ProductList from '../pages/Products'
import ProductDetail from '../pages/ProductDetail'
import Cart from '../pages/Cart/Cart'
import AdminLayout from '../components/layout/AdminLayout'
import Users from '../pages/adminManagement/Users/Users'
import Products from '../pages/adminManagement/Products/Products'
import Orders from '../pages/adminManagement/Orders/Orders'
import Category from '../pages/adminManagement/Category/Category'
import DashBoard from '../pages/adminManagement/DashBoard/DashBoard'

const ProtectedRoute = ({ children, admin = false }) => {
  const {
    authStore: { isAuthenticated, isAdmin, loading }
  } = useStore()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login', { state: { from: location.pathname }, replace: true })
    } else if (admin && !isAdmin && !loading) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, isAdmin, admin, location, navigate, loading])

  return children
}

const AuthRoute = ({ children }) => {
  const { authStore } = useStore()
  const { isAuthenticated, isAdmin, loading } = authStore
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && !isAdmin) {
        navigate('/', { replace: true })
      } else if (isAdmin) {
        navigate('/admin', { replace: true })
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate])

  if (loading || isAuthenticated || isAdmin) {
    return null
  }

  return children
}

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
        <Route path='/products' element={<ProductList />} />
        <Route path='/product' element={<Navigate to='/products' replace />} />
        <Route path='/product/:id' element={<ProductDetail />} />
        <Route path='/cart' element={<Cart />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/my-orders'
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route element={<AdminLayout />}>
        <Route
          path='/admin/users'
          element={
            <ProtectedRoute admin={true}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/products'
          element={
            <ProtectedRoute admin={true}>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/orders'
          element={
            <ProtectedRoute admin={true}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/category'
          element={
            <ProtectedRoute admin={true}>
              <Category />
            </ProtectedRoute>
          }
        />
      
       
        <Route
          path='/admin/dashboard'
          element={
            <ProtectedRoute admin={true}>
              <DashBoard />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path='*' element={<Navigate to='/not-found' replace />} />
    </Routes>
  )
})

export default AppRoutes
