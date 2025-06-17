import React from 'react'
import Layout from '../common/layout'
import Sidebar from '../common/Sidebar'

const Dashboard = () => {
  return (
  <Layout>
    
{/* <h1>Dashboard</h1>
<button className='btn btn-danger'>Logout</button>
 -*/}

 <div className='container'>
  <div className='row'>
   <div className='d-flex justify-content-between mt-5 pb-3'>
    <div className='h4 pb-0 mb-0'>Dashboard</div>
   </div>
   <div className='col-md-3'>
    <Sidebar/>
   </div>


   <div className='col-md-9'>
    {/* Users, Orders, Products in a single row */}
    <div className='row'>
        {/* Users Card */}
        <div className='col-md-4'>
            <div className='card shadow'>
                <div className='card-body'>
                    <h2>1</h2>
                    <span>Users</span>
                </div>
                <div className='card-footer'>
                    <a href="#">View Users</a>
                </div>
            </div>
        </div>

        {/* Orders Card */}
        <div className='col-md-4'>
            <div className='card shadow'>
                <div className='card-body'>
                    <h2>0</h2>
                    <span>Orders</span>
                </div>
                <div className='card-footer'>
                    <a href="#">View Orders</a>
                </div>
            </div>
        </div>

        {/* Products Card */}
        <div className='col-md-4'>
            <div className='card shadow'>
                <div className='card-body'>
                    <h2>0</h2>
                    <span>Products</span>
                </div>
                <div className='card-footer'>
                    <a href="#">View Products</a>
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

export default Dashboard
