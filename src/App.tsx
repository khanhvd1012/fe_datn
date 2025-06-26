// App.tsx
import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexAdmin from './components/LayoutAdmin'
import IndexClient from './components/LayoutClient'
import ErrorBoundary from './components/ErrorBoundary' // ✅ import
import PrivateRoute from "./components/PrivateRoute";
import Profile from './pages/Client/Profile'
import Brand from './pages/Client/Brand'

function App() {
  return (
    <ErrorBoundary> {/* ✅ bọc toàn bộ cây */}
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
