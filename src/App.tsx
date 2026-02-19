import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import './App.css'

import NotificationsManager from './features/NotificationsManager'
import { AppRouter } from './router/AppRouter'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsManager />
      <RouterProvider router={AppRouter} />
    </QueryClientProvider>
  )
}

export default App
