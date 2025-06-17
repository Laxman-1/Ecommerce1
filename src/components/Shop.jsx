import React, { useState, useEffect } from 'react'; 
import { useSearchParams } from 'react-router-dom';
import Layout from './common/layout';
import { Link } from 'react-router-dom';
import { apiUrl } from '../components/common/http';

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [catChecked, setCatChecked] = useState(() => {
    const category = searchParams.get('category');
    return category ? category.split(',') : [];
  });

  const [brandChecked, setBrandChecked] = useState(() => {
    const brand = searchParams.get('brand');
    return brand ? brand.split(',') : [];
  });

  const fetchProducts = () => {
    let search = [];

    if (catChecked.length > 0) {
      search.push(['category', catChecked.join(',')]);
    }

    if (brandChecked.length > 0) {
      search.push(['brand', brandChecked.join(',')]);
    }

    let params = new URLSearchParams(search);

    if (search.length > 0) {
      setSearchParams(params);
    } else {
      setSearchParams({});
    }

    fetch(`${apiUrl}/get-products?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 200) {
          setProducts(result.data);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  const fetchCategories = () => {
    fetch(`${apiUrl}/get-categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 200) {
          setCategories(result.data);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch(error => console.error('Error fetching categories:', error));
  };

  const fetchBrands = () => {
    fetch(`${apiUrl}/get-brands`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 200) {
          setBrands(result.data);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch(error => console.error('Error fetching brands:', error));
  };

  const handleCategory = (e) => {
    const { checked, value } = e.target;

    if (checked) {
      setCatChecked(prev => [...prev, value]);
    } else {
      setCatChecked(prev => prev.filter(id => id !== value));
    }
  };

  const handleBrand = (e) => {
    const { checked, value } = e.target;

    if (checked) {
      setBrandChecked(prev => [...prev, value]);
    } else {
      setBrandChecked(prev => prev.filter(id => id !== value));
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [catChecked, brandChecked]);

  return (
    <Layout>
      <div className="container">
        <nav aria-label="breadcrumb" className="py-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#">Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">Shop</li>
          </ol>
        </nav>
        <div className="row">
          {/* Categories Section */}
          <div className="col-md-3">
            <div className="card shadow border-0 mb-3">
              <div className="card-body p-4">
                <h3>Categories</h3>
                <ul>
                  {categories && categories.map(category => (
                    <li key={`cat-${category.id}`} className="mb-2">
                      <input
                        type="checkbox"
                        value={category.id}
                        checked={catChecked.includes(category.id.toString())}
                        onChange={handleCategory}
                      />
                      <label htmlFor="" className="ps-2">{category.name}</label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="card-body shadow border-0 mb-3 p-4">
              <h3>Brands</h3>
              <ul>
                {brands && brands.map(brand => (
                  <li key={`bra-${brand.id}`} className="mb-2">
                    <input
                      type="checkbox"
                      value={brand.id}
                      checked={brandChecked.includes(brand.id.toString())}
                      onChange={handleBrand}
                    />
                    <label htmlFor="" className="ps-2">{brand.name}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Section */}
          <div className="col-md-9">
            <div className="row pb-5">
              {products && products.map(product => (
                <div key={`product-${product.id}`} className="col-md-4 col-6">
                  <div className="product card border-0 mb-4">
                    <div className="card-img">
                      <img src={product.image_url} alt={product.title} className="w-100" />
                    </div>
                    <div className="card-body pt-3">
                      <Link to={`/Product/${product.id}`}>{product.title}</Link>
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
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
