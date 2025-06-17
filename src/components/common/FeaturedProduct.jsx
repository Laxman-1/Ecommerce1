import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Make sure Link is imported
import { apiUrl } from './http';

const FeaturedProduct = () => {
  const [products, setProducts] = useState([]); // Declaring the state outside the function

  const fetchFeaturedProducts = () => {
    fetch(apiUrl + '/get-feature-products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then((res) => res.json()) // Parse the JSON response
      .then((result) => {
        setProducts(result.data); // Set the product data to state
        console.log(result); // Log the result to the console
      })
      .catch((error) => {
        console.error('Error fetching data:', error); // Log the error if there's one
      });
  };

  useEffect(() => {
    fetchFeaturedProducts(); // Fetch data on component mount
  }, []);

  return (
    <section className="section-2 py-5">
      <div className="container">
        <h2>Featured Products</h2>
        <div className="row mt-4">
          {products.map((product) => (
            <div key={product.id} className="col-md-3 col-6">
              <div className="product card border-0">
                <div className="card-img">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image_url || '/default_image_url.jpg'} // Ensure fallback image URL is valid
                      alt={product.title}
                      className="w-100"
                    />
                  </Link>
                </div>
                <div className="card-body pt-3">
                  <Link to={`/product/${product.id}`}>{product.title}</Link>
                  <div className="price">
                    Rs {product.price}
                    {product.compare_price && (
                      <span className="text-decoration-line-through">
                        Rs {product.compare_price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
