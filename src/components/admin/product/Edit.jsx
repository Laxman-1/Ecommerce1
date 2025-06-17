import React, { useEffect, useState, useRef, useMemo } from 'react';
import Sidebar from '../../common/Sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../../common/layout';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { adminToken, apiUrl } from '../../common/http';
import JoditEditor from 'jodit-react';

const Edit = ({ placeholder }) => {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [disable, setDisable] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productImages, setProductImages] = useState([]); 
  const navigate = useNavigate();
  const param=useParams();
  const { register, handleSubmit, setError, reset, formState: { errors } } = useForm();

  useEffect(() => {
      const fetchProductData = async () => {
          try {
              const res = await fetch(`${apiUrl}/products/${param.id}`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'Authorization': `Bearer ${adminToken()}`,
                  }
              });

              const result=await res.json();
              
            if(result.status===200){
              reset({
                title: result.data.title || "",  
                description: result.data.description || "", 
                price: result.data.price || "", 
                compare_price: result.data.compare_price || "",  
                category: result.data.category_id || "", 
                brand: result.data.brand_id ||"",
                sku: result.data.sku || "", 
                qty: result.data.qty || "",  
                short_description: result.data.short_description || "",  
                status: result.data.status || "",  
                is_featured: result.data.is_featured ||"",  
                barcode: result.data.barcode || "",  
              });
            setProductImages(result.data.product_images||[])}
            else{
              toast.error(result.message||"Failed to fetch product");
            }
             
          } catch (error) {
              console.error("Error fetching product:", error);
              toast.error("Error fetching product");
          }
      };
  
      if (param.id) fetchProductData();
  }, [param.id, reset]);
  

  const config = useMemo(() => ({
    readonly: false,
    placeholder: placeholder || ''
  }), [placeholder]);

  // Fetch categories and brands on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetch(`${apiUrl}/categories`, {
          headers: { Authorization: `Bearer ${adminToken()}` }
        });
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.data || []);

        // Fetch brands
        const brandsRes = await fetch(`${apiUrl}/brands`, {
          headers: { Authorization: `Bearer ${adminToken()}` }
        });
        const brandsData = await brandsRes.json();
        setBrands(brandsData.data || []);
      } catch (error) {
        toast.error('Failed to load initial data');
      }
    };
    fetchData();
  }, []); // Empty dependency array to run once

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setDisable(true);

    try {
      const res = await fetch(`${apiUrl}/temp-images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken()}` },
        body: formData
      });
      const result = await res.json();

      if (result.data) {
        setProductImages(prev => [...prev, {
          id: result.data.id,
          url: result.data.image_url
        }]);
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setDisable(false);
      e.target.value = ''; // Clear file input
    }
  };

  const deleteImage = (imageId) => {
    setProductImages(prev => prev.filter(img => img.id !== imageId));
  };

  const saveProduct = async (data) => {
    const formData = {
      ...data,
      description: content,
      productImages:productImages.map(img => img.id) // Send only IDs to API
    };

    setDisable(true);
    try {
      const res = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken()}`
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      
      if (result.status === 200) {
        toast.success('Product created!');
        navigate('/admin/products');
      } else {
        // Handle backend validation errors
        Object.entries(result.errors || {}).forEach(([field, messages]) => {
          setError(field, { type: 'manual', message: messages[0] });
        });
        toast.error(result.message || 'Validation failed');
      }
    } catch (error) {
      toast.error('Network error - please try again');
    } finally {
      setDisable(false);
    }
  };

  return (
    <Layout>
  <div className='container'>
    <div className='row'>
      <div className='d-flex justify-content-between mt-5 pb-3'>
        <div className='h4 pb-0 mb-0'>Products /Edit</div>
        <Link to="/admin/products" className='btn btn-primary'>Back</Link>
      </div>
      <div className='col-md-3'>
        <Sidebar />
      </div>
      <div className='col-md-9'>
        <form onSubmit={handleSubmit(saveProduct)}>
          <div className='row'>
            <div className='col-md-12'>
              <div className='card shadow'>
                <div className='card-body p-4'>
                  <div className='mb-3'>
                    <label className='form-label'>Title</label>
                    <input
                      type='text'
                      placeholder='Title'
                      {...register('title', { required: 'Title field is required' })}
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    />
                    {errors.title && <p className="invalid-feedback">{errors.title?.message}</p>}
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label htmlFor="category" className="form-label">Category</label>
                      <select
                        id="category"
                        {...register('category', { required: 'Category field is required' })}
                        className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                      >
                        <option value="">Select a category</option>
                        {categories && categories.map((category) => (
                          <option key={`category-${category.id}`} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && <div className="invalid-feedback">{errors.category?.message}</div>}
                    </div>

                    <div className='col-md-6'>
                  <label className="form-label" htmlFor='brand'>Brand</label>
                  <select
                    id="brand"
                    {...register('brand')}
                    className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select a Brand</option> {/* Keep this for NULL values */}
                    {brands && brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  {errors.brand && <div className="invalid-feedback">{errors.brand.message}</div>}
                </div>

                  </div>

                  <div className='mb-3'>
                    <label htmlFor='short_description' className='form-label'>
                      Short Description
                    </label>
                    <textarea
                      {...register('short_description')} 
                      id='short_description'
                      className='form-control'
                      placeholder='Short Description'
                      rows={3}
                    />
                  </div>

                  <div className='mb-3'>
                    <label className='form-label'>Description</label>
                    <JoditEditor
                     // {...register('description')} 
                      ref={editor}
                      value={content}
                      config={config}
                      tabIndex={1}
                      onBlur={newContent => setContent(newContent)}
                    />
                  </div>

                  <h3 className='pt-3 border-bottom mb-3'>Pricing</h3>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='mb-3'>
                        <label className='form-label'>Price</label>
                        <input
                          type="text"
                          placeholder='Price'
                          {...register('price', { required: 'Price field is required' })}
                          className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                        />
                        {errors.price && <p className="invalid-feedback">{errors.price?.message}</p>}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='mb-3'>
                        <label className='form-label'>Discounted Price</label>
                        <input type="text" 
                         {...register('compare_price')} 
                        placeholder='Discounted Price' className='form-control' />
                      </div>
                    </div>
                  </div>

                  <h3 className='pt-3 border-bottom mb-3'>Inventory</h3>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='mb-3'>
                        <label className='form-label'>SKU</label>
                        <input
                          type="text"
                          placeholder='SKU'
                          {...register('sku', { required: 'SKU field is required' })}
                          className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
                        />
                        {errors.sku && <p className="invalid-feedback">{errors.sku?.message}</p>}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='mb-3'>
                        <label className='form-label'>Barcode</label>
                        <input
                          type="text"
                          placeholder='Barcode'
                          {...register('barcode', { required: 'Barcode field is required' })}
                          className={`form-control ${errors.barcode ? 'is-invalid' : ''}`}
                        />
                        {errors.barcode && <p className="invalid-feedback">{errors.barcode?.message}</p>}
                      </div>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='mb-3'>
                        <label className='form-label'>Quantity</label>
                        <input type="text" 
                          {...register('qty')} 
                        placeholder='Quantity' className='form-control' />
                      </div>
                    </div>
                    <div className='col-md-6'>
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
                    <div className='col-md-6'>
                    <div className='mb-3'>
                      <label className='form-label'>Featured</label>
                      <select
                        {...register('is_featured', { required: 'Featured field is required' })}
                        className={`form-control ${errors.is_featured ? 'is-invalid' : ''}`}
                      >
                        <option value="yes">Yes</option> {/* Match ENUM values */}
                        <option value="no">No</option>
                      </select>
                      {errors.is_featured && <p className="invalid-feedback">{errors.is_featured.message}</p>}
                    </div>
                  </div>

                  </div>

                  <h3 className='pt-3 border-bottom mb-3'>Gallery</h3>
                  <div className='mb-3'>
  <label className='form-label'>Image</label>
  <input
    onChange={handleFile}
    type="file" 
    className='form-control' 
  />
</div>

        <div className='mb-3'>
          <div className='row'>
            { productImages && productImages.map((productImage,index) => (
              <div className='col-md-3 mb-3' key={`image-${index}`}>
                <div className='card shadow position-relative'>
                  <img 
                    src={productImage.image_url} // Correct the src to use image.image_url
                    alt="Gallery" 
                    className='card-img-top' 
                  />
                  <button 
                    type='button'
                    className='btn btn-danger btn-sm position-absolute top-0 end-0'
                    onClick={() => deleteImage(image)}
                  >
                    &times;
                  </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button disabled={disable} type='submit' className='btn btn-primary mt-3 mb-5'>Update</button>
        </form>
      </div>
    </div>
  </div>
</Layout>

  );
};

export default Edit
