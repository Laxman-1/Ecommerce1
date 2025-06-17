import React from 'react'
import Layout from '../common/Layout'
import Sidebar from '../common/Sidebar'
import { Link } from 'react-router-dom'
import UserSidebar from '../common/UserSidebar'

const Profile = () => {
  return (
      
    <Layout>
    
    {/* <h1>Dashboard</h1>
    <button className='btn btn-danger'>Logout</button>
     -*/}
    
     <div className='container'>
      <div className='row'>
       <div className='d-flex justify-content-between mt-5 pb-3'>
        <div className='h4 pb-0 mb-0'>Categories</div>
        <Link to =" "className=' btn btn-primary'>Button</Link>
      
       </div>
       <div className='col-md-3'>
        <UserSidebar/>
       </div>
    
    
       <div className='col-md-9'>
        {/* Users, Orders, Products in a single row */}
        <div className='row'>
            {/* Users Card */}
            <div className='col-md-12'>
                <div className='card shadow'>
                    <div className='card-body p-4'>
                        
                    </div>
                    
                </div>
            </div>
    
            
    
           
        </div>
    </div>
    
      </div>
     </div>
      </Layout>
  )
}

export default Profile
