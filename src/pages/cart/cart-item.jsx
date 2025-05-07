import React, { useContext,useState } from "react";
import { ShopContext } from "../../context/shop-context";

export const CartItem = (props) => {
  const { id, productName, price, productImage } = props.data;
  const { cartItems, addToCart, removeFromCart, updateCartItemCount } =
    useContext(ShopContext);

     // State to manage the coupon code input
  const [couponCode, setCouponCode] = useState("");

  const handleCouponCodeChange = (event) => {
    setCouponCode(event.target.value);
  };
  return (
    <div className="cartItem">
      <img src={productImage} />
      <div className="description">
        <p>
          <b>{productName}</b>
        </p>
        <p> Price: Rs.{price}</p>
        <div className="countHandler">
          <button onClick={() => removeFromCart(id)} style={{padding:'4%',fontSize:'75%',background:'#007bff',border:'none',color:'white',borderRadius:'5px'}}> Remove </button>
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={handleCouponCodeChange}
            style={{
              width : '40%',
              padding: '4%', 
              fontSize: '75%', 
              margin: '5%', 
              border: '1px solid #ccc', 
              borderRadius: '5px'
            }}
          />
        </div>
      </div>
    </div>
  );
};
