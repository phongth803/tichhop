import { observer } from 'mobx-react-lite'
import AppRoutes from './routes'
import { ToastContainer } from 'react-toastify'
import { useStore } from '@/stores/rootStore'
import { Center, Spinner } from '@chakra-ui/react'
import 'react-toastify/dist/ReactToastify.css'

const App = observer(() => {
  const { authStore } = useStore()

  if (authStore.loading) {
    return (
      <Center h='100vh'>
        <Spinner size='xl' color='red.500' />
      </Center>
    )
  }

  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
      <AppRoutes />
    </>
  )
})

export default App
