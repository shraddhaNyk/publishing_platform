
// import React, { useState,useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";

// const Checkout = () => {
//   const location = useLocation();
//   const [country, setCountry] = useState("India");
//   const [state, setState] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [paymentSuccess, setPaymentSuccess] = useState(false); // Track payment success
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Track success message visibility
//   const [couponCode, setCouponCode] = useState(""); // State for coupon code

//   const [availableCoupons, setAvailableCoupons] = useState([]); // Available coupons state
//   const [selectedCoupon, setSelectedCoupon] = useState(null); // Selected coupon state
//   const [discount, setDiscount] = useState(0); // State for discount
//   const [couponDiscount, setCouponDiscount] = useState(95);
//    // Fetch coupons when component mounts
//    useEffect(() => {
//     const fetchCoupons = async () => {
//       try {
//         const response = await axios.get("/api/coupons");
//         setAvailableCoupons(response.data);
//       } catch (error) {
//         console.error("Error fetching coupons:", error);
//       }
//     };
//     fetchCoupons();
//   }, []);
//   // Extract cartItems from location state
//   const cartItems = location.state?.cartItems || [];

//   const calculateTotal = () => {
//     if (paymentSuccess) {
//       return 0; // Set total to 0 after successful payment
//     }
//     return cartItems.reduce((total, item) => total + parseFloat(item.price), 0);
//   };

//   const handleCouponApply = async () => {
//     if (!selectedCoupon) {
//       alert("Please select a coupon to apply.");
//       return;
//     }

//     try {
//       const response = await axios.post("/api/coupons/apply", { code: selectedCoupon.code });
//       if (response.status === 200) {
//         const { discountAmount } = response.data;
//         setCouponCode(selectedCoupon.code);
//         setCouponDiscount(discountAmount);
//         setDiscount(discountAmount);
//         alert("Coupon applied successfully!");
//       } else {
//         alert("Invalid coupon code.");
//       }
//     } catch (error) {
//       console.error("Error applying coupon:", error);
//       alert("An error occurred while applying the coupon. Please try again.");
//     }
//   };
//   const handleSubmit = async () => {
//     if (paymentMethod === "IJST Wallets (currently accept)") {
//       const totalAmount = calculateTotal();

//       try {
//         // Send the total amount and transaction details to the backend
//         const response = await axios.post("/api/checkout", {
//           transaction_amount: totalAmount,
//           transaction_type: "debit",
//           remarks: "Payment for order",
//           receiver: "IJST"
//         });

//         // Handle the response from the backend
//         if (response.status === 200) {
//           setPaymentSuccess(true); // Mark payment as successful
//           setShowSuccessMessage(true); // Show the success message box
//           // Add any additional actions (e.g., redirecting to another page)
//         } else {
//           alert("Payment failed");
//         }
//       } catch (error) {
//         console.error("Error during payment:", error);
//         alert("An error occurred during payment. Please try again.");
//       }
//     } else {
//       alert("Please select IJST Wallets as the payment method to proceed.");
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto", fontFamily: "'Roboto', sans-serif" }}>
//       <h2 style={{ fontSize: "36px", marginBottom: "20px", color: "#333", textAlign: "center" }}>Checkout</h2>

//       {showSuccessMessage && (
//         <div style={{
//           position: "fixed",
//           top: "20px",
//           right: "20px",
//           backgroundColor: "#d4edda",
//           color: "#155724",
//           border: "1px solid #c3e6cb",
//           borderRadius: "5px",
//           padding: "15px",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//           zIndex: 1000
//         }}>
//           <strong>Success!</strong> Payment completed successfully.
//         </div>
//       )}

//       <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        
//         {/* Billing Address Section */}
//         <div style={{ flex: "1", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
//           <h3 style={{ fontSize: "24px", marginBottom: "10px", color: "#333" }}>Billing address</h3>
//           {/* Country and State selection inputs */}
//           <div style={{ marginBottom: "20px" }}>
//             <label style={{ fontSize: "16px", fontWeight: "bold", color: "#555" }}>Country</label>
//             <select
//               value={country}
//               onChange={(e) => setCountry(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 marginTop: "10px",
//                 fontSize: "16px",
//                 borderRadius: "4px",
//                 border: "1px solid #ccc",
//                 backgroundColor: "#f7f7f7"
//               }}
//             >
//               <option value="India">India</option>
//               {/* Add more countries here */}
//             </select>
//           </div>
//           <div style={{ marginBottom: "20px" }}>
//             <label style={{ fontSize: "16px", fontWeight: "bold", color: "#555" }}>State / Union Territory</label>
//             <input
//               type="text"
//               value={state}
//               onChange={(e) => setState(e.target.value)}
//               placeholder="Please select..."
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 marginTop: "10px",
//                 fontSize: "16px",
//                 borderRadius: "4px",
//                 border: "1px solid #ccc",
//                 backgroundColor: "#f7f7f7"
//               }}
//             />
//           </div>
//         </div>
        
//         {/* Summary Section */}
//         <div style={{
//           flex: "1",
//           backgroundColor: "#f9f9f9",
//           padding: "20px",
//           borderRadius: "8px",
//           boxShadow: "0 0 10px rgba(0,0,0,0.1)"
//         }}>
//           <h3 style={{ fontSize: "24px", marginBottom: "10px", color: "#333" }}>Summary</h3>
//           {cartItems.length > 0 ? (
//             <div>
//               {cartItems.map((item, index) => (
//                 <div key={index} style={{ marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
//                   <p style={{ fontSize: "16px", margin: "0", color: "#555" }}>{item.title}</p>
//                   <p style={{ fontSize: "16px", margin: "0", fontWeight: "bold", color: "#333" }}>Price: {item.price}</p>
//                 </div>
//               ))}
//               <p style={{ fontSize: "20px", fontWeight: "bold", marginTop: "20px", color: "#333" }}>Total: ₹{calculateTotal()}</p>
//             </div>
//           ) : (
//             <p style={{ fontSize: "16px", color: "#555" }}>No items in the cart.</p>
//           )}
//           <button
//             onClick={handleSubmit}
//             style={{
//               backgroundColor: "#6c63ff",
//               color: "white",
//               padding: "15px",
//               width: "100%",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//               fontSize: "18px",
//               fontWeight: "bold",
//               boxShadow: "0 5px 10px rgba(0,0,0,0.1)"
//             }}
//           >
//             Complete Checkout
//           </button>
//         </div>
//       </div>
      
//        {/* Coupon Code Section */}
// <div style={{ marginTop: "40px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
//   <p style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>Best Coupon For You</p>
//   <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//     {couponCode && (
//       <>
//         <span style={{ flex: "1", backgroundColor: "#f7f7f7", padding: "10px 15px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px" }}>
//           {couponCode}
//         </span>
//         <span style={{ color: 'green', fontSize: "16px" }}>
//           Saved ₹{couponDiscount}
//         </span>
//         <button
//           onClick={() => setCouponCode('')}
//           style={{
//             padding: "10px 15px",
//             fontSize: "16px",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//             backgroundColor: "#f7f7f7",
//             cursor: "pointer"
//           }}
//         >
//           Remove
//         </button>
//       </>
//     )}
//     {!couponCode && (
//       <p style={{ fontSize: "16px", color: "#666" }}>No coupon applied.</p>
//     )}
//   </div>
// </div>

      
      
//       {/* Payment Method Section */}
//       <div style={{ marginTop: "40px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
//         <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>Payment method</h3>
//         <div style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: "15px"
//         }}>
//           {["IJST Wallets (currently accept)", "Credit/Debit Card", "UPI", "Net Banking", "Mobile Wallets"].map((method) => (
//             <div key={method} style={{ display: "flex", alignItems: "center", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", backgroundColor: "#f7f7f7", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
//               <input
//                 type="radio"
//                 value={method}
//                 name="paymentMethod"
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 style={{ marginRight: "15px" }}
//               />
//               <label style={{ fontSize: "16px", color: "#555" }}>{method}</label>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       {/* Order Details Section */}
//       <div style={{ marginTop: "40px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
//         <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>Order details</h3>
//         {cartItems.length > 0 ? (
//           <div>
//             {cartItems.map((item, index) => (
//               <div key={index} style={{ marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
//                 <p style={{ fontSize: "16px", margin: "0", color: "#555" }}>{item.title}</p>
//                 <p style={{ fontSize: "16px", margin: "0", fontWeight: "bold", color: "#333" }}>Price: {item.price}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p style={{ fontSize: "16px", color: "#555" }}>No items in the cart.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Checkout;





import React, { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const location = useLocation();
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Track payment success
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Track success message visibility
  const [couponCode, setCouponCode] = useState(""); // State for coupon code

  const [availableCoupons, setAvailableCoupons] = useState([]); // Available coupons state
  const [selectedCoupon, setSelectedCoupon] = useState(null); // Selected coupon state
  const [discount, setDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(95);

  
   // Fetch coupons when component mounts
   useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/coupons/apply");
        setAvailableCoupons(response.data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };
    fetchCoupons();
  }, []);

  // Extract cartItems from location state
  const cartItems = location.state?.cartItems || [];

  const calculateTotal = () => {
    if (paymentSuccess) {
      return 0; // Set total to 0 after successful payment
    }
    return cartItems.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  const handleCouponApply = async () => {
    if (!couponCode) {
      alert("Please enter a coupon code.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3002/api/coupons/apply", { code: couponCode });
      if (response.status === 200) {
        const { coupon } = response.data;
        setSelectedCoupon(coupon);
        setDiscount(coupon.discount_amount);
        alert("Coupon applied successfully!");
      } else {
        alert("Invalid coupon code.");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      alert("An error occurred while applying the coupon. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (paymentMethod === "IJST Wallets (currently accept)") {
      const totalAmount = calculateTotal();

      try {
        // Send the total amount and transaction details to the backend
        const response = await axios.post("/api/checkout", {
          transaction_amount: totalAmount,
          transaction_type: "debit",
          remarks: "Payment for order",
          receiver: "IJST"
        });

        // Handle the response from the backend
        if (response.status === 200) {
          setPaymentSuccess(true); // Mark payment as successful
          setShowSuccessMessage(true); // Show the success message box
          // Add any additional actions (e.g., redirecting to another page)
        } else {
          alert("Payment failed");
        }
      } catch (error) {
        console.error("Error during payment:", error);
        alert("An error occurred during payment. Please try again.");
      }
    } else {
      alert("Please select IJST Wallets as the payment method to proceed.");
    }
  };



  
  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto", fontFamily: "'Roboto', sans-serif" }}>
      <h2 style={{ fontSize: "36px", marginBottom: "20px", color: "#333", textAlign: "center" }}>Checkout</h2>

      {showSuccessMessage && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          backgroundColor: "#d4edda",
          color: "#155724",
          border: "1px solid #c3e6cb",
          borderRadius: "5px",
          padding: "15px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1000
        }}>
          <strong>Success!</strong> Payment completed successfully.
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        
        {/* Billing Address Section */}
        <div style={{ flex: "1", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: "24px", marginBottom: "10px", color: "#333" }}>Billing address</h3>
          {/* Country and State selection inputs */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "16px", fontWeight: "bold", color: "#555" }}>Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#f7f7f7"
              }}
            >
              <option value="India">India</option>
              {/* Add more countries here */}
            </select>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "16px", fontWeight: "bold", color: "#555" }}>State / Union Territory</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Please select..."
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#f7f7f7"
              }}
            />
          </div>
        </div>
        
        {/* Summary Section */}
        <div style={{
          flex: "1",
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ fontSize: "24px", marginBottom: "10px", color: "#333" }}>Summary</h3>
          {cartItems.length > 0 ? (
            <div>
              {cartItems.map((item, index) => (
                <div key={index} style={{ marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                  <p style={{ fontSize: "16px", margin: "0", color: "#555" }}>{item.title}</p>
                  <p style={{ fontSize: "16px", margin: "0", fontWeight: "bold", color: "#333" }}>Price: ₹{item.price}</p>
                </div>
              ))}

              <p style={{ fontSize: "20px", fontWeight: "bold", marginTop: "20px", color: "#333" }}>
                Subtotal: ₹{cartItems.reduce((total, item) => total + parseFloat(item.price), 0)}
              </p>

              <p style={{ fontSize: "18px", marginTop: "10px", color: "#555" }}>
               Coupon Discount: ₹{discount}
              </p>

              <p style={{ fontSize: "20px", fontWeight: "bold", marginTop: "20px", color: "#333" }}>
                Total: ₹{calculateTotal()}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: "16px", color: "#555" }}>No items in the cart.</p>
          )}
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#6c63ff",
              color: "white",
              padding: "15px",
              width: "100%",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
              boxShadow: "0 5px 10px rgba(0,0,0,0.1)"
            }}
          >
            Complete Checkout
          </button>
        </div>
      </div>
        {/* Coupon Code Section */}


        <div style={{ marginTop: "40px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>Apply Coupon Code</h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            style={{
              flex: "1",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#f7f7f7"
            }}
          />
          <button
            onClick={handleCouponApply}
            style={{
              backgroundColor: "#005a8e",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            Apply
          </button>
        </div>
      </div>
      
      {/* Payment Method Section */}
      <div style={{ marginTop: "40px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>Payment method</h3>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}>
          {["IJST Wallets (currently accept)", "Credit/Debit Card", "UPI", "Net Banking", "Mobile Wallets"].map((method) => (
            <div key={method} style={{ display: "flex", alignItems: "center", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", backgroundColor: "#f7f7f7", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <input
                type="radio"
                value={method}
                name="paymentMethod"
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ marginRight: "15px" }}
              />
              <label style={{ fontSize: "16px", color: "#555" }}>{method}</label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Order Details Section */}
      <div style={{ marginTop: "40px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>Order details</h3>
        {cartItems.length > 0 ? (
          <div>
            {cartItems.map((item, index) => (
              <div key={index} style={{ marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                <p style={{ fontSize: "16px", margin: "0", color: "#555" }}>{item.title}</p>
                <p style={{ fontSize: "16px", margin: "0", fontWeight: "bold", color: "#333" }}>Price: {item.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "16px", color: "#555" }}>No items in the cart.</p>
        )}
      </div>
    </div>
  );
};

export default Checkout;




