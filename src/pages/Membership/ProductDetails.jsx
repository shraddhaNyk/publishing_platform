

import React from "react";

export const ProductDetails = ({ data, onAddToCart, onBack, isAddedToCart }) => {
  const { productName, price, productImage, description } = data;

  // Function to render different details based on product name
  const renderSubscriptionDetails = () => {
    switch (productName) {
      case "Student Subscription":
        return (
          <>
            <h3>Subscription Benefits:</h3>
            <ul>
              <li>Ability to publish papers and books</li>
              <li>Access to a community of learners</li>
              <li>Only Rs. 199 per month</li>
            </ul>
          </>
        );
      case "Academician Subscription":
        return (
          <>
            <h3>Subscription Benefits:</h3>
            <ul>
              <li>Access specialized content</li>
              <li>Publish research papers</li>
              <li>Only Rs. 99 per month</li>
            </ul>
          </>
        );
      case "Employee Subscription":
        return (
          <>
            <h3>Subscription Benefits:</h3>
            <ul>
              <li>Access industry-specific research</li>
              <li>Publish case studies</li>
              <li>Only Rs. 99 per month</li>
            </ul>
          </>
        );
      case "Business Subscription":
        return (
          <>
            <h3>Subscription Benefits:</h3>
            <ul>
              <li>Access market analyses</li>
              <li>Publish industry reports</li>
              <li>Only Rs. 99 per month</li>
            </ul>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="product-details">
      <img src={productImage} alt={productName} />
      <div className="details-description">
        <h3 className="ProductHead">{productName}</h3>
        <p>{description}</p>
        {/* <p> Rs. {price}</p> */}
        <p>{renderSubscriptionDetails()}</p> {/* Render subscription details */}
      </div>
      <div className="button-row">
        <button
          className={`addToCartBttn ${isAddedToCart ? "addedToCart" : ""}`}
          onClick={onAddToCart}
        >
          {isAddedToCart ? "Added" : "Add To Cart"}
        </button>
        <button className="Details" onClick={onBack}>Back</button>
      </div>
    </div>
  );
};

