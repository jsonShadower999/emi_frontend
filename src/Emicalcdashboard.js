import React, { useState } from 'react';
import axios from 'axios';

const Emicalcdashboard = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [emiDetails, setEmiDetails] = useState(null);
  const [showPersonalPopup, setShowPersonalPopup] = useState(false);
  const [showDocumentPopup, setShowDocumentPopup] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState({
    name: '', address: '', pincode: '', mobile_no: '', email: '', adhar_card: null, pan_card: null,
  });

  const calculateEMI = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/emi_info/', {
        loan_amount: loanAmount,
        tenure: tenure,
        intrest_rate: interestRate,
      });
      setEmiDetails(response.data);
    } catch (error) {
      console.error('Error calculating EMI:', error);
    }
  };
  const handleEnrollmentSubmit = async () => {
    const formData = new FormData();
    
    // Append all the data without arrays
    formData.append('name', enrollmentData.name);
    formData.append('address', enrollmentData.address);
    formData.append('pincode', enrollmentData.pincode);
    formData.append('mobile_no', enrollmentData.mobile_no);
    formData.append('email', enrollmentData.email);
    formData.append('adhar_card', enrollmentData.adhar_card); // assuming file is handled correctly
    formData.append('pan_card', enrollmentData.pan_card);     // assuming file is handled correctly
    
    try {
      const response = await axios.post('http://localhost:8000/api/enroller_client/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.status === 200) {
        alert('Enrollment Submitted Successfully!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error in form submission');
    }
  };
  
//   const handleEnrollmentSubmit = async () => {
//     try {
//       const formData = new FormData();
//       for (let key in enrollmentData) {
//         formData.append(key, enrollmentData[key]);
//       }
//       await axios.post('http://localhost:8000/api/enroller_client/', formData);
//       alert('Enrollment Submitted Successfully!');
//       setShowDocumentPopup(false); // Close the popup after submission
//     } catch (error) {
//       console.error('Error submitting enrollment:', error);
//     }
//   };

  const handleFileChange = (e) => {
    setEnrollmentData({ ...enrollmentData, [e.target.name]: e.target.files[0] });
  };

  return (
    <div>
      <h2>EMI Calculator</h2>
      <input
        type="number"
        placeholder="Loan Amount"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Tenure (months)"
        value={tenure}
        onChange={(e) => setTenure(e.target.value)}
      />
      <input
        type="number"
        placeholder="Interest Rate (%)"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
      />
      <button onClick={calculateEMI}>Submit</button>

      {emiDetails && (
        <div>
          <h3>EMI Details</h3>
          <p>EMI: {emiDetails.emi}</p>
          <p>Total Amount: {emiDetails.total_amt}</p>
          <p>Interest Amount: {emiDetails.interest_amt}</p>
          <p>Principle Amount: {emiDetails.principal_amt}</p>
          <button onClick={() => setShowPersonalPopup(true)}>Get Enroll</button>
        </div>
      )}

      {showPersonalPopup && (
        <div className="popup">
          <h3>Enrollment Form</h3>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setEnrollmentData({ ...enrollmentData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            onChange={(e) => setEnrollmentData({ ...enrollmentData, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="Pincode"
            onChange={(e) => setEnrollmentData({ ...enrollmentData, pincode: e.target.value })}
          />
          <input
            type="text"
            placeholder="Mobile Number"
            onChange={(e) => setEnrollmentData({ ...enrollmentData, mobile_no: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEnrollmentData({ ...enrollmentData, email: e.target.value })}
          />
          <button onClick={() => setShowPersonalPopup(false) || setShowDocumentPopup(true)}>
            Next
          </button>
        </div>
      )}

      {showDocumentPopup && (
        <div className="popup">
          <h3>Document Upload</h3>
          <input
            type="file"
            name="adhar_card"
            onChange={handleFileChange}
          />
          <input
            type="file"
            name="pan_card"
            onChange={handleFileChange}
          />
          <button onClick={handleEnrollmentSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default Emicalcdashboard;
