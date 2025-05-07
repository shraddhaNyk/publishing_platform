import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price), 0);
  };
  
  const handleBoxClick = (course) => {
    navigate('/CoursePage', { state: { course } });
  };

  const handleRemoveClick = (indexToRemove) => {
    const updatedCartItems = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCartItems);
  };

  const handleCheckoutClick = () => {
    // Redirect to the login page with cart data
    navigate('/Checkout', { state: { cartItems } });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px' }}>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
              }}
              onClick={() => handleBoxClick(item)}
            >
              {item.image_url ? (
                <img
                  src={`http://localhost:3001${item.image_url}`}
                  alt={item.title}
                  style={{
                    width: '100px',
                    height: 'auto',
                    marginRight: '20px',
                    borderRadius: '10px',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    marginRight: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: '#888',
                  }}
                >
                  No Image
                </div>
              )}
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ margin: '0 0 5px', fontSize: '20px' }}>{item.title}</h3>
                <p style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 'bold' }}>₹{item.price}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <a
                  href="#"
                  style={{ marginRight: '20px', color: '#007791', fontSize: '14px' }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering onClick of the box
                    handleRemoveClick(index); // Remove item from cart
                  }}
                >
                  Remove
                </a>
                <a href="#" style={{ color: '#007791', fontSize: '14px' }}>
                  Save for Later
                </a>
              </div>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '40px',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            <div>Total: ₹{calculateTotal()}</div>
            <button
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#a435f0',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={handleCheckoutClick} // Trigger login redirect on click
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
