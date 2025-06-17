import React, { useState } from 'react';
import Layout from '../../common/layout';
import Sidebar from '../../common/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { adminToken, apiUrl } from '../../common/http';

const Create = () => {
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const saveCategory = async (data) => {
        setDisable(true);

        try {
            const res = await fetch(`${apiUrl}/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${adminToken()}`,
                },
               
                body: JSON.stringify(data),
            });

            const result = await res.json();
            setDisable(false);

            if (result.status === 200) {
                console.log(data);
                toast.success("Category created successfully!");
                navigate('/admin/categories');
            } else {
                console.log("Something went wrong:", result.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setDisable(false);
        }
    };

    return (
        <Layout>
            <div className='container'>
                <div className='row'>
                    <div className='d-flex justify-content-between mt-5 pb-3'>
                        <div className='h4 pb-0 mb-0'>Categories/Create</div>
                        <Link to="/admin/categories" className='btn btn-primary'>Back</Link>
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
                            <button disabled={disable} type='submit' className='btn btn-primary mt-3'>Create</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Create;
