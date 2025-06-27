// App.tsx
import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexAdmin from './components/LayoutAdmin'
import IndexClient from './components/LayoutClient'
import Brand from './pages/Client/Brand'
import ErrorBoundary from 'antd/es/alert/ErrorBoundary'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <ErrorBoundary> 
      <Routes>
        <Route path="/admin/*" element={
          <PrivateRoute requiredRole="admin">
            <IndexAdmin />
          </PrivateRoute>
        } />
        <Route path="/*" element={<IndexClient />} />
        <Route path="/brand/:id" element={<Brand />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App