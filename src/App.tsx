// App.tsx
import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexAdmin from './components/LayoutAdmin'
import IndexClient from './components/LayoutClient'
import ErrorBoundary from 'antd/es/alert/ErrorBoundary'
import PrivateRoute from './components/PrivateRoute'
import AdminLogin from './pages/Auth/login-admin'

function App() {
  return (
    <ErrorBoundary> 
      <Routes>
        <Route path="/admin/*" element={
          <PrivateRoute requiredRole="admin">
            <IndexAdmin />
          </PrivateRoute>
        } />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/*" element={<IndexClient />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App