
import './App.css'
import { Route, Routes } from 'react-router-dom'
import ClientLayout from './layouts/clients/ClientLayout'
import Client from './components/client/Client'
import AdminLayout from './layouts/admin/AdminLayout'
import DashBoard from './components/admin/DashBoard'
import ListProduct from './components/admin/products/ListProduct'
import Login from './components/auth/Login'
import Register from './components/auth/Register'

function App() {
  return (
    <>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route index element={<Client />}></Route>
        </Route>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={< DashBoard />}></Route>
          <Route path='products' element={<ListProduct/>}></Route>
        </Route>
         <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
