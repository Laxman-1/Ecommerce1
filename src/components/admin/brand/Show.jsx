import React, { useEffect, useState } from 'react';
import Sidebar from '../../common/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../common/layout';
import { adminToken, apiUrl } from '../../common/http';
import Loader from '../../common/Loader'; // Import Loader component
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const Show = () => {
  const [brands, setBrands] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  // Fetch brands from the API
  const fetchBrands = async () => {
    setLoader(true);
    try {
      const res = await fetch(`${apiUrl}/brands`, {
        // Corrected: Added space between `await` and `fetch`
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Corrected: Changed "content-type" to "Content-Type"
          Authorization: `Bearer ${adminToken()}`, // Corrected: Added parentheses to `adminToken`
        },
      });
      const result = await res.json();
      setLoader(false);
      if (result.status === 200) {
        // Corrected: Changed `==` to `===` for strict comparison
        setBrands(result.data);
      } else {
        console.log('Something went wrong:', result.message || 'Unknown error');
        toast.error(result.message || 'Failed to fetch brands'); // Added toast notification
      }
    } catch (error) {
      console.log('Something went wrong:', error.message || 'Unknown error'); // Corrected: Used `error.message` instead of `result.message`
      setLoader(false);
      toast.error('Error while fetching brands'); // Added toast notification
    }
  };

  // Delete a brand
  const deleteBrand = async (id) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      try {
        const res = await fetch(`${apiUrl}/brands/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken()}`,
          },
        });
        const result = await res.json();
        if (result.status === 200) {
          toast.success(result.message);
          fetchBrands(); // Refresh the brands list after deletion
        } else {
          console.log('Something went wrong:', result.message || 'Unknown error');
          toast.error(result.message || 'Failed to delete brand');
        }
      } catch (error) {
        console.log('Something went wrong:', error.message || 'Unknown error');
        toast.error('An error occurred while deleting the brand');
      }
    }
  };

  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <div className="h4 pb-0 mb-0">Brands</div>
            <Link to="/admin/brands/create" className="btn btn-primary">
              Create
            </Link>
            {/* Corrected: Updated `to` prop to a valid route */}
          </div>

          <div className="col-md-3">
            <Sidebar />
          </div>

          <div className="col-md-9">
            <div className="row">
              <div className="col-md-12">
                <div className="card shadow">
                  <div className="card-body p-4">
                    {/* Show loader if data is loading */}
                    {loader ? (
                      <Loader />
                    ) : brands.length > 0 ? (
                      // Corrected: Changed `categories` to `brands`
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th width="50">ID</th>
                            <th>Name</th>
                            <th width="100">Status</th>
                            <th width="100">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {brands.map((brand) => (
                            <tr key={brand.id}>
                              <td>{brand.id}</td>
                              <td>{brand.name}</td>
                              <td>
                                {brand.status === 1 ? (
                                  <span className="badge text-bg-success">Active</span>
                                ) : (
                                  <span className="badge text-bg-danger">Blocked</span>
                                )}
                              </td>
                              <td>
                                <Link
                                  className="text-primary"
                                  to={`/admin/brands/edit/${brand.id}`} // Corrected: Updated route to `/admin/brands/edit`
                                >
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 512 512"
                                    height="20"
                                    width="20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"></path>
                                  </svg>
                                </Link>
                                <span style={{ margin: '0 10px' }}></span>
                                <button
                                  className="text-danger ms-2 border-0 bg-transparent"
                                  onClick={() => deleteBrand(brand.id)} // Corrected: Changed `deleteCategory` to `deleteBrand`
                                  style={{ cursor: 'pointer' }} // Add pointer cursor for better UX
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="18"
                                    fill="currentColor"
                                    className="bi bi-trash3"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No brands found.</p> // Corrected: Changed "No categories found" to "No brands found"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Show;