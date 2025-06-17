import { createContext, useState } from "react";

// Create Cart Context
export const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
    const [cartData, setCartData] = useState(JSON.parse(localStorage.getItem('cart')) || []);

    const addToCart = (product, size = null) => {
        let updatedCart = [...cartData];

        // Check if product already exists in the cart
        const existingProductIndex = updatedCart.findIndex(item => item.product_id === product.id && item.size === size);

        if (existingProductIndex !== -1) {
            // If the product exists, update its quantity
            updatedCart[existingProductIndex].qty += 1;
        } else {
            // If the product doesn't exist in the cart, add it
            updatedCart.push({
                id: `${product.id}-${Math.floor(Math.random() * 10000000)}`, // Unique ID
                product_id: product.id,
                title: product.title,  // Only one title property here
                size: size,
                price: product.price,
                qty: 1,
                image_url: product.image_url
            });
        }

        setCartData(updatedCart); // Update cart state
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save to localStorage
    };

    const clearCart = () => {
        setCartData([]); // Clear cart state
        localStorage.removeItem('cart'); // Remove cart from localStorage
    };

    return (
        <CartContext.Provider value={{ addToCart, cartData, setCartData, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
