// App.tsx
import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexAdmin from './components/LayoutAdmin'
import IndexClient from './components/LayoutClient'
import ErrorBoundary from './components/ErrorBoundary' // ✅ import
import PrivateRoute from "./components/PrivateRoute";

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
      </Routes>
    </ErrorBoundary>
  )
}

export default App
