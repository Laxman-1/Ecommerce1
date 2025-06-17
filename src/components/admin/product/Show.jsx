import React, { useEffect, useState } from 'react';
import Sidebar from '../../common/Sidebar';
import Layout from '../../common/layout';
import { Link } from 'react-router-dom';
import { adminToken, apiUrl } from '../../common/http';
import Loader from '../../common/Loader';

// Assuming you have a `Nostate` component for handling the "no data" case
import Nostate from '../../common/Nostate'; 

const Show = () => {
    const [products, setProducts] = useState([]);
    const [loader, setLoader] = useState(false);

    const fetchProducts = async () => {
        setLoader(true);
        try {
            const res = await fetch(`${apiUrl}/products`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${adminToken()}`,
                },
            });

            const result = await res.json();
            setLoader(false);
            if (result.status === 200) {
                setProducts(result.data);
            } else {
                console.log("Something went wrong:", result.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setLoader(false);
        }
    };
    const deleteProduct = async (productId) => {
        setLoader(true); // Show loader while making the API request
        try {
            const res = await fetch(`${apiUrl}/products/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${adminToken()}`,
                },
            });
    
            const result = await res.json();
            setLoader(false); // Hide the loader
    
            if (result.status === 200) {
                // If the deletion is successful, update the product list
                // You can either fetch the updated list again or remove the deleted product from the current list.
                setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
            } else {
                console.log("Something went wrong:", result.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            setLoader(false); // Hide loader even in case of error
        }
    };
    

    useEffect(() => {
        fetchProducts();
    }, []);
    useEffect(()=>{
        deleteProduct();
    },[])

    return (
        <Layout>
            <div className='container'>
                <div className='row'>
                    <div className='d-flex justify-content-between mt-5 pb-3'>
                        <div className='h4 pb-0 mb-0'>Products/Show</div>
                        <Link to="/admin/products/create" className='btn btn-primary'>Create</Link>
                    </div>
                    <div className='col-md-3'>
                        <Sidebar />
                    </div>

                    <div className='col-md-9'>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='card shadow'>
                                    <div className='card-body p-4'>
                                        {loader && <Loader />}
                                        {!loader && products.length === 0 && <Nostate text="Product not found" />}
                                        {!loader && products.length > 0 && (
                                            <table className='table'>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Image</th>
                                                        <th>Title</th>
                                                        <th>Price</th>
                                                        <th>Qty</th>
                                                        <th>Sku</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                               <tbody>
                                                   {
                                                    products.map(product=>{
                                                        return(
                                                        <tr>
                                                        <td>{product.id}</td>
                                                        <td>
                                                        <img src={product.image_url} alt="Product Image" width={70} />
                                                    </td>

                                                        <td>{product.title}</td>
                                                        <td>{product.price}</td>
                                                        <td>{product.qty}</td>
                                                       <td>{product.sku}</td>
                                                            <td>
                                                            {product.status === 1 ? (
                                                                <span className='badge text-bg-success'>Active</span>
                                                            ) : (
                                                                <span className='badge text-bg-danger'>Inactive</span>
                                                            )}
                                                        </td>
                                                         <td>
                                                                                        <Link
                                                                                          className="text-primary"
                                                                                          to={`/admin/products/edit/${product.id}`}
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
                                                                                        <span style={{ margin: "0 10px" }}></span>
                                                                                        <Link
                                                                                          className="text-danger ms-2"
                                                                                          onClick={() => deleteProduct(product.id)}
                                                                                          style={{ cursor: "pointer" }} // Add pointer cursor for better UX
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
                                                                                        </Link>
                                                                                      </td>
                                                        </tr>
                                                      )  })
                                                   }
                                                </tbody>
                                            </table>
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
