
import React, { useState, useContext } from "react";
import { ShopContext } from "../../context/shop-context";
import { ProductDetails } from "./ProductDetails"; // Correctly import ProductDetails

export const Product = (props) => {
  const { id, productName, price, productImage } = props.data;
  const { addToCart, cartItems } = useContext(ShopContext);

  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [showDetails, setShowDetails] = useState(false); // State to toggle between product and details view

  const cartItemCount = cartItems[id];

  const handleAddToCart = () => {
    addToCart(id);
    setIsAddedToCart(true);
  };

  const handleShowDetails = () => {
    setShowDetails(true);
  };

  const handleBack = () => {
    setShowDetails(false);
  };

  return (
    <>
      {showDetails ? (
        <ProductDetails
          data={props.data}
          onAddToCart={handleAddToCart}
          onBack={handleBack}
          isAddedToCart={isAddedToCart}
        />
      ) : (
        <div className="product">
          <img src={productImage} />
          <div className="description">
            <p>
              <b>{productName}</b>
            </p>
            <p> Rs. {price}</p>
          </div>
          <div className="button-row">
            <button
              className={`addToCartBttn ${isAddedToCart ? "addedToCart" : ""}`}
              onClick={handleAddToCart}
            >
              {isAddedToCart ? "Added" : "Add To Cart"}
            </button>
            <button className="Details" onClick={handleShowDetails}>Details</button>
          </div>
        </div>
      )}
    </>
  );
};
