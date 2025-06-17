import React from 'react';
import Layout from './common/Layout';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Ensure toast is imported
import { apiUrl } from './common/http'; // Ensure apiUrl is defined elsewhere in your code

const Register = () => {
    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        // Make sure the data is being sent to the right API URL
        fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => res.json()) // Correctly parse the response as JSON
        .then(result => {
            console.log(result); // Log the result for debugging

            if (result.status === 200) {
                // If registration is successful, navigate to the login page
                toast.success(result.success || 'Registration successful');
                navigate('/account/userlogin');
            } else {
                // Handle form errors
                const formErrors = result.errors;
                if (formErrors) {
                    Object.keys(formErrors).forEach((field) => {
                        setError(field, { message: formErrors[field][0] }); // Correctly map error messages
                    });
                }

                toast.error(result.message || 'Registration failed! Please check the errors.');
            }
        })
        .catch((error) => {
            // Catch any unexpected errors
            toast.error('Something went wrong, please try again later.');
            console.error(error); // Log the error for debugging
        });
    };

    return (
        <Layout>
            <div className="container d-flex justify-content-center py-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card shadow border-0 login">
                        <div className="card-body p-4">
                            <h3 className='border-bottom mb-3'>User Registration</h3>

                            {/* Username Input */}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">UserName</label>
                                <input
                                    {...register('name', { required: 'The field name is required' })}
                                    type="text"
                                    id="name"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    placeholder="Enter your username"
                                />
                                {errors.name && <p className="invalid-feedback">{errors.name?.message}</p>}
                            </div>

                            {/* Email Input */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    {...register('email', {
                                        required: 'The email field is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                    type="email"
                                    id="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    placeholder="Enter Email Address"
                                />
                                {errors.email && <p className="invalid-feedback">{errors.email?.message}</p>}
                            </div>

                            {/* Password Input */}
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    {...register('password', { required: 'Password field is required' })}
                                    type="password"
                                    id="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder="Enter password"
                                />
                                {errors.password && <p className="invalid-feedback">{errors.password?.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="d-grid">
                                <button type="submit" className="btn btn-secondary">Register</button>
                                <div className="d-flex justify-content-center pt-4 pb-2">
                                    Already have an account? &nbsp; <a href="/account/userlogin">Login</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Register;
