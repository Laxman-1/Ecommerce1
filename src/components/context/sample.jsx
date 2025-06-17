import React from 'react'
import Sidebar from '../common/Sidebar'
import { Link } from 'react-router-dom'
const sample = () => {
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
        <Sidebar/>
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

export default sample
