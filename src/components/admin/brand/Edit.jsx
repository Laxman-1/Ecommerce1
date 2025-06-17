import React, { useState, useEffect } from 'react'; // Added useState and useEffect imports
import Sidebar from '../../common/Sidebar';
import Layout from '../../common/layout'; // Ensure 'layout' is capitalized if the component name is Layout
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { adminToken, apiUrl } from '../../common/http';
import { toast } from 'react-toastify'; // Ensure toast is imported for success/error notifications

const Edit = () => {
  const [disable, setDisable] = useState(false);
  const [brand, setBrand] = useState({}); // Used useState to store brand data
  const navigate = useNavigate();
  const params = useParams(); // Access route params to get the brand ID

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => { // Used useEffect to fetch the brand data when the component mounts
    const fetchBrand = async () => {
      const res = await fetch(`${apiUrl}/brands/${params.id}`, { // Fetch brand details using the id
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${adminToken()}`,
        },
      });

      const result = await res.json();
      if (result.status === 200) {
        setBrand(result.data); // Set the brand data to state
        reset({
          name: result.data.name, // Populate form fields with fetched data
          status: result.data.status.toString(), // Convert status to string for select field
        });
      } else {
        console.log("Something went wrong");
      }
    };

    fetchBrand();
  }, [params.id, reset]); // Re-run fetch when params.id or reset changes

  const saveBrand = async (data) => {
    setDisable(true); // Disable the submit button to prevent multiple submissions
    const res = await fetch(`${apiUrl}/brands/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${adminToken()}`,
      },
      body: JSON.stringify(data), // Send the updated data to the server
    });

    const result = await res.json();
    setDisable(false); // Re-enable the submit button after the request is complete
    if (result.status === 200) {
      toast.success(result.message); // Show success toast if update was successful
      navigate('/admin/brands'); // Navigate to brands list after success
    } else {
      toast.error(result.message); // Show error toast if something went wrong
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <div className="h4 pb-0 mb-0">Edit Brand</div>
            <Link to="/admin/brands" className="btn btn-primary">Back to Brands</Link>
          </div>
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <form onSubmit={handleSubmit(saveBrand)}>
              <div className="row">
                <div className="col-md-12">
                  <div className="card shadow">
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          {...register('name', { required: 'Name field is required' })}
                          placeholder="Name"
                        />
                        {errors.name && <p className="invalid-feedback">{errors.name?.message}</p>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Status</label>
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
              <button disabled={disable} type="submit" className="btn btn-primary mt-3">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
