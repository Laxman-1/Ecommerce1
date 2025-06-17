import { useState } from 'react'
import './App.css'
import { BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './components/Home'
import Shop from './components/Shop'
import Product from './components/Product'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Login from './components/admin/Login'
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './components/admin/Dashboard'
import { AdminRequireAuth } from './components/admin/AdminRequireAuth'

import {default as ShowCategories}from './components/admin/category/Show'
import {default as CreateCategories} from './components/admin/category/Create'
import {default as EditCategories} from './components/admin/category/Edit'

import {default as Showbrands}from './components/admin/brand/Show'
import {default as Createbrands} from './components/admin/brand/Create'
import {default as Editbrands} from './components/admin/brand/Edit'


import {default as ShowProducts}from './components/admin/product/Show'
import {default as CreateProducts} from './components/admin/product/Create'
import {default as EditProducts} from './components/admin/product/Edit'
import Register from './components/Register'
import UserLogin from './components/UserLogin'
import Profile from './components/context/Profile'
import { RequireAuth } from './components/context/RequireAuth'
import Billing from './components/Billing'
import UserOrder from './components/userOrder'
import Orders from './components/admin/Orders'




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<BrowserRouter>
<Routes>
     <Route path='/' element={<Home/>}/>
     <Route path='/shop' element={<Shop/>}/>
     <Route path='/product/:id' element={<Product/>}/>
     <Route path='/register' element={<Register/>}/>
     <Route path='/userlogin' element={<UserLogin/>}/>
     <Route path='/cart' element={<Cart/>}/>
   
{/*      <Route path='/checkout' element={<Checkout/>}/>
user routes    
*/}

<Route path='/account' element={
 <RequireAuth>
 <Profile/>
 </RequireAuth>
} />

<Route path='/checkout' element={
 <RequireAuth>
 <Checkout/>
 </RequireAuth>
} />

<Route path='/billing' element={
 <RequireAuth>
 <Billing/>
 </RequireAuth>
} />

<Route path='/user-orders' element={
  <RequireAuth>
    <UserOrder/>
  </RequireAuth>
}/>

<Route path='/admin/login' element={<Login/>}/>
<Route path='/admin/dashboard' element={
 <AdminRequireAuth>
  <Dashboard/>
 </AdminRequireAuth>
} />
<Route path='/admin/Categories' element={
 <AdminRequireAuth>
 <ShowCategories/>
 </AdminRequireAuth>
} />


<Route path='/admin/Categories/create' element={
 <AdminRequireAuth>
 <CreateCategories/>
 </AdminRequireAuth>
} />

<Route path='/admin/categories/edit/:id'
 element={
 <AdminRequireAuth>
<EditCategories/>
 </AdminRequireAuth>
}/>


<Route path='/admin/brands' element={
 <AdminRequireAuth>
 <Showbrands/>
 </AdminRequireAuth>
} />

<Route path='/admin/brands/create' element={
 <AdminRequireAuth>
 <Createbrands/>
 </AdminRequireAuth>
} />

<Route path='/admin/brands/edit/:id' element={
 <AdminRequireAuth>
 <Editbrands/>
 </AdminRequireAuth>
} />



<Route path='/admin/products' element={
 <AdminRequireAuth>
<ShowProducts/>
 </AdminRequireAuth>
} />

<Route path='/admin/products/create' element={
 <AdminRequireAuth>
 <CreateProducts/>
 </AdminRequireAuth>
} />

<Route path='/admin/products/edit/:id' element={
 <AdminRequireAuth>
 <EditProducts/>
 </AdminRequireAuth>
} />
<Route path='/admin/orders' element={
 <AdminRequireAuth>
 <Orders/>
 </AdminRequireAuth>
} />



</Routes>
</BrowserRouter>
<ToastContainer />
    </>
  )
}

export default App
