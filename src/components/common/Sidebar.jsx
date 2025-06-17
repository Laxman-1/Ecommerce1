import React from 'react'

import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='card shadow mb-5 sidebar'>
      <div className='card-body p-4'>
       <ul>
        <li>
          <a href="">Dashboard</a>
        </li>
        <li>
          <Link to="/admin/categories">Categories</Link>
        </li>
        <li>
          <Link to="/admin/brands">Brands</Link>
        </li>
        <li>
          <Link to="/admin/products">Products</Link>
        </li>
        <li>
          <a href="/admin/orders">Orders</a>
        </li>
       {/* <li>
          <a href="">Users</a>
        </li>
        <li>
          <a href="">Shipping</a>
        </li>
        <li>
          <a href=" ">Change Password</a>
        </li>*/}
        <li>
          <a href="logout">logout</a>
        </li>
       </ul>
      </div>
    </div>
  )
}

export default Sidebar
