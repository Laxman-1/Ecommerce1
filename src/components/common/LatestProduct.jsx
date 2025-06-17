import React, { useEffect, useState } from 'react';
import { apiUrl } from './http';
import { Link } from 'react-router-dom';

const LatestProduct = () => {
  const [products, setProducts] = useState([]); // Changed Products to products for convention

  const latestProducts = async () => {
    await fetch(apiUrl + '/get-latest-products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProducts(result.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  };

  useEffect(() => {
    latestProducts(); // Call the latestProducts function to fetch products
  }, []);

  return (
    <section className='section-2 pt-5'>
      <div className='container'>
        <h2>New Arrivals</h2>
        <div className='row mt-4'>
          {products && products.length > 0 ? (
            products.map((product) => {
              return (
                <div className='col-md-3 col-6' key={product.id}>
                  <div className='product card border-0'>
                    <div className='card-img'>
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.image_url || '/default_image_url.jpg'} // Fallback image if no product image is found
                          alt={product.title}
                          className='w-100'
                        />
                      </Link>
                    </div>
                    <div className='card-body pt-3'>
                      <Link to={`/product/${product.id}`}>{product.title}</Link>
                      <div className='price'>
                        Rs {product.price}{' '}
                        {product.compare_price && (
                          <span className='text-decoration-line-through'>
                            Rs {product.compare_price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className='col-12'>No new arrivals found.</div> // Show a message if no products are available
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestProduct;
