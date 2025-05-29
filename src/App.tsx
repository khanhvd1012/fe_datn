import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexAdmin from './components/LayoutAdmin'
import IndexClient from './components/LayoutClient'

function App() {

  return (
    <>
      <Routes>
        <Route path='/admin/*' element={<IndexAdmin />} />
        <Route path='/*' element={<IndexClient />} />
      </Routes>
    </>
  )
}

export default App
