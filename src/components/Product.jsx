import React, { useEffect, useState, useContext } from 'react';
import Layout from './common/layout';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, FreeMode, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Rating } from 'react-simple-star-rating';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { apiUrl } from './common/http';
import { CartContext } from './context/cart';
import { toast } from 'react-toastify';

const Product = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [rating, setRating] = useState(4);
    const [productImages, setProductImages] = useState([]);
    const [product, setProduct] = useState(null);
    const [sizeSelected, setSizeSelected] = useState(null);
    const [productSizes, setProductSizes] = useState([]);
    const params = useParams();
    const { addToCart } = useContext(CartContext);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`${apiUrl}/get-product/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            const result = await response.json();
            if (result.status === 200) {
                setProduct(result.product);
                setProductImages(result.product.gallery);
                setProductSizes(result.product.sizes);
            } else {
                toast.error("Something went wrong. Please try again later.");
            }
        } catch (error) {
            toast.error("Unable to fetch product details. Please try again.");
            console.error('Error fetching product:', error);
        }
    };

    const handleAddToCart = () => {
        if (productSizes.length > 0 && sizeSelected == null) {
            toast.error("Please select a size.");
        } else {
            const productWithImage = {
                ...product,
                image_url: productImages[0],  // Assuming first image is the main product image
            };
            
            addToCart(productWithImage, sizeSelected);
           
            toast.success("Product successfully added to cart");
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [params.id]);

    if (!product) {
        return <div>Loading...</div>; // Consider adding a spinner here for better UX
    }

    return (
        <Layout>
            <div className='container product-detail'>
                <div className='row'>
                    <nav aria-label="breadcrumb" className="py-4">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to='/'>Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to='/shop'>Shop</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                {product.title}
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className='row'>
                    <div className='col-md-5'>
                        <div className='row'>
                            <div className='col-2'>
                                <Swiper
                                    style={{
                                        '--swiper-navigation-color': '#000',
                                        '--swiper-pagination-color': '#000',
                                    }}
                                    onSwiper={setThumbsSwiper}
                                    loop={true}
                                    direction="vertical"
                                    spaceBetween={10}
                                    slidesPerView={4}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="mySwiper mt-2"
                                >
                                    {productImages.map((product_image, index) => (
                                        <SwiperSlide key={product_image.id || index}>
                                            <div className="content">
                                                <img
                                                    src={product_image}
                                                    alt={`Product Thumbnail ${index + 1}`}
                                                    height={100}
                                                    className="w-100"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            <div className="col-10">
                                <Swiper
                                    style={{
                                        '--swiper-navigation-color': '#000',
                                        '--swiper-pagination-color': '#000',
                                    }}
                                    loop={true}
                                    spaceBetween={10}
                                    navigation={true}
                                    thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="mySwiper2"
                                >
                                    {productImages.map((product_image, index) => (
                                        <SwiperSlide key={product_image.id || index}>
                                            <div className="content">
                                                <img
                                                    src={product_image}
                                                    alt={`Product Image ${index + 1}`}
                                                    className="w-100"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-7">
                        <h2>{product.title}</h2>
                        <div className='d-flex'>
                            <Rating size={20} readonly initialValue={rating} />
                            <span className='pt-1 ps-2'> 20 Reviews</span>
                        </div>
                        <div className="price py-3">
                            Rs {product.price}
                            {product.compare_price && (
                                <span className="text-decoration-line-through">
                                    Rs {product.compare_price}
                                </span>
                            )}
                        </div>
                        <div>{product.short_description}</div>
                        <div className='pt-3'>
                            <strong>Select Size</strong>
                            <div className='sizes pt-2'>
                                {productSizes.map((size, index) => (
                                    <button
                                        key={index}
                                        className={`btn btn-size ms-1 ${sizeSelected === size ? 'selected' : ''}`}
                                        onClick={() => setSizeSelected(size)}
                                    >
                                        {size.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='add-to-cart my-4'>
                           <Link to="/cart"><button onClick={handleAddToCart} className='btn btn-primary text-uppercase'>
                                Add to Cart
                            </button></Link> 
                        </div>

                        <hr />
                        <div className='mb-5'>
                            <strong>SKU:</strong>
                            {product.sku}
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-md-12 pb-5'>
                            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
                                <Tab eventKey="home" title="Description">
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                </Tab>
                                <Tab eventKey="profile" title="Reviews">
                                    Reviews
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Product;
