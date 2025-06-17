import React, { useState, useEffect } from 'react';
import Layout from '../../common/layout';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../common/Sidebar';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminToken, apiUrl } from '../../common/http';

const Edit = () => {
  const [disable, setDisable] = useState(false);
  const [category, setCategory] = useState({});
  const navigate = useNavigate();
  const params = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await fetch(`${apiUrl}/categories/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${adminToken()}`,
        },
      });

      const result = await res.json();
      if (result.status === 200) {
        setCategory(result.data);
        reset({
          name: result.data.name,
          status: result.data.status.toString(),
        });
      } else {
        console.log("Something went wrong");
      }
    };

    fetchCategory();
  }, [params.id, reset]);

  const saveCategory = async (data) => {
    setDisable(true);
    const res = await fetch(`${apiUrl}/categories/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${adminToken()}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    setDisable(false);
    if (result.status === 200) {
      toast.success(result.message);
      navigate('/admin/categories'); // Updated redirect path
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Layout>
      <div className='container'>
        <div className='row'>
          <div className='d-flex justify-content-between mt-5 pb-3'>
            <div className='h4 pb-0 mb-0'>Edit Category</div>
            <Link to="/admin/categories" className='btn btn-primary'>Back to Categories</Link>
          </div>
          <div className='col-md-3'>
            <Sidebar />
          </div>
          <div className='col-md-9'>
            <form onSubmit={handleSubmit(saveCategory)}>
              <div className='row'>
                <div className='col-md-12'>
                  <div className='card shadow'>
                    <div className='card-body p-4'>
                      <div className='mb-3'>
                        <label className='form-label'>Name</label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          {...register('name', { required: 'Name field is required' })}
                          placeholder='Name'
                        />
                        {errors.name && <p className="invalid-feedback">{errors.name?.message}</p>}
                      </div>
                      <div className='mb-3'>
                        <label className='form-label'>Status</label>
                        <select
                          {...register('status', { required: 'Status field is required' })}
                          className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                        >
                          <option value="">Select a status</option>
                          <option value="1">Active</option>
                          <option value="0">Blocked</option>
                        </select>
                        {errors.status && <p className="invalid-feedback">{errors.status?.message}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button disabled={disable} type='submit' className='btn btn-primary mt-3'>Update</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Edit;