import React from 'react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/Auth'

const UserSidebar = () => {
    const {logout}=useContext(AuthContext);

  return (
    <div className='card shadow mb-5 sidebar'>
      <div className='card-body p-4'>
       <ul>
        
        <li>
          <Link to="/account">Account</Link>
        </li>
    
        <li>
          <a href="/user-orders">Orders</a>
        </li>
        {/*<li>
          <a href="">Change Password</a>
        </li>
        <li>
          <a href="">Shipping</a>
        </li>*/}
        <li>
          <a href=" "onClick={logout}>logout</a>
        </li>
       </ul>
      </div>
    </div>
  )
}

export default UserSidebar
