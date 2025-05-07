import React, { useState } from 'react';
import axios from 'axios';

function Coupons() {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('Fixed cart discount');
  const [discountAmount, setDiscountAmount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimitPerCoupon, setUsageLimitPerCoupon] = useState('');
  const [usageLimitPerItem, setUsageLimitPerItem] = useState('');
  const [usageLimitPerUser, setUsageLimitPerUser] = useState('');
  const [section, setSection] = useState('general');
  const [status, setStatus] = useState('Draft');
  const [visibility, setVisibility] = useState('Public');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState(''); // New state for description
 
  const formatDateForMySQL = (date) => {
    const pad = (num) => (num < 10 ? '0' + num : num);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };



  
  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const generateCouponCode = async () => {
    const newCode = generateRandomCode();
    setCode(newCode);
  };

    const handlePublish = async () => {
      try {
      const discountValue = discountAmount.trim() === '' ? 0.00 : parseFloat(discountAmount);

      const response = await axios.post('http://localhost:3002/api/coupons', {
        code,
        discount_type: discountType,
        discount_amount: discountValue,
        expiry_date: expiryDate || null,
        usage_limit_per_coupon: usageLimitPerCoupon || null,
        usage_limit_per_item: usageLimitPerItem || null,
        usage_limit_per_user: usageLimitPerUser || null,
        status: 'Published',  // Set status to Published
        visibility: visibility,
        publish_date: formatDateForMySQL(new Date(publishDate)),
      
        description  // Include description in the payload
      });

      if (response.status === 201) {
        alert('Coupon generated successfully');
      }
    } catch (error) {
      console.error('Error generating coupon:', error);
      alert('Failed to generate coupon. Please try again.');
    }
  };



  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
      {/* Coupon Code Section */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Coupon Code</label>
        <input type="text" value={code} readOnly style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #bbb' }} />
        <button
          onClick={generateCouponCode}
          style={{ padding: '12px', width: '100%', backgroundColor: '#005a8e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          Generate Coupon Code
        </button>
      </div>
        {/* Description Section */}
        <div style={{ marginBottom: '25px' }}>
        <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #bbb' }}
          placeholder="Enter a description for the coupon"
        />
      </div>

      {/* General / Usage Limits Section */}
      <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => setSection('general')}
          style={{
            flex: 1,
            marginRight: '10px',
            padding: '12px',
            backgroundColor: section === 'general' ? '#005a8e' : '#aaa',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          General
        </button>
        <button
          onClick={() => setSection('usage_limits')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: section === 'usage_limits' ? '#005a8e' : '#aaa',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Usage Limits
        </button>
      </div>

      {section === 'general' && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Discount Type</label>
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #bbb' }}>
  <option value="Fixed cart discount">Fixed Cart Discount</option>
  <option value="Percentage discount">Percentage Discount</option>
</select>

          </div>

          <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Coupon Amount</label>
        <input 
            type="number" 
            value={discountAmount} 
            onChange={(e) => setDiscountAmount(e.target.value)} 
            style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #bbb' }} 
            placeholder="Enter a valid amount"
            required // Make this field required
        />
        </div>



          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Coupon Expiry Date</label>
            <input 
              type="date" 
              value={expiryDate} 
              onChange={(e) => setExpiryDate(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #bbb' }} 
            />

          </div>
        </div>
      )}

      {section === 'usage_limits' && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Usage Limit per Coupon</label>
            <input type="number"   placeholder="Unlimited usage" value={usageLimitPerCoupon} onChange={(e) => setUsageLimitPerCoupon(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #bbb' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Limit Usage to X Items</label>
            <input type="number"   placeholder="Apply to all Qualifying items in cart" value={usageLimitPerItem} onChange={(e) => setUsageLimitPerItem(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #bbb' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Usage Limit per User</label>
            <input type="number"   placeholder="Unlimited usage " value={usageLimitPerUser} onChange={(e) => setUsageLimitPerUser(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #bbb' }} />
          </div>
        </div>
      )}

      {/* Publish Section */}
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Publish</h2>
        <p style={{ margin: '8px 0', fontSize: '14px' }}>
          <strong>Status:</strong> {status} <a href="#" style={{ color: '#0073aa' }}>Edit</a>
        </p>
        <p style={{ margin: '8px 0', fontSize: '14px' }}>
          <strong>Visibility:</strong> {visibility} <a href="#" style={{ color: '#0073aa' }}>Edit</a>
        </p>
        <p style={{ margin: '8px 0', fontSize: '14px' }}>
            <strong>Published on:</strong> 
                <input 
                type="date" 
                value={publishDate} 
                onChange={(e) => setPublishDate(e.target.value)} 
                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #bbb' }} />
        </p>
        <button
          onClick={handlePublish}
          style={{ padding: '12px 20px', backgroundColor: '#005a8e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', display: 'block', width: '100%' }}
        >
          Publish
        </button>
      </div>
    </div>
  );
}

export default Coupons;




