import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Emicalcdashboard.css'; // Assuming you already imported your CSS here

const Emicalcdashboard = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [emiDetails, setEmiDetails] = useState(null);
  const [showPersonalPopup, setShowPersonalPopup] = useState(false);
  const [showDocumentPopup, setShowDocumentPopup] = useState(false);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postOfficeName, setPostOfficeName] = useState('');
  const [data, setData] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup

  const [enrollmentData, setEnrollmentData] = useState({
    name: '',
    address: '',
    pincode: '',
    mobile: '',
    email: '',
    adhar_card: null,
    pan_card: null,
    intrest_rate: '',
    loan_amount: '',
    tenure: '',
    city: '',
    country: '',
    post_office_name: ''
  });

  // Fetch the data from the local JSON file
  useEffect(() => {
    fetch('/data.json') // Correct path to the public folder
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((error) => {
        console.error('Error loading data:', error);
      });
  }, []);

  const handlePincodeChange = (e) => {
    const enteredPincode = e.target.value;
    setEnrollmentData({ ...enrollmentData, pincode: enteredPincode });

    // Find the data corresponding to the entered pincode
    const location = data.find((item) => item.pincode === enteredPincode);

    if (location) {
      setCity(location.city);
      setCountry(location.country);
      setPostOfficeName(location.postOfficeName);
    } else {
      setCity('');
      setCountry('');
      setPostOfficeName('');
    }
  };

  // Calculate EMI
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

  // Handle form data for enrollment and file upload
  const handleEnrollmentSubmit = async () => {
    const formData = new FormData();

    // Append all enrollment data to the FormData object
    formData.append('name', enrollmentData.name);
    formData.append('address', enrollmentData.address);
    formData.append('pincode', enrollmentData.pincode);
    formData.append('mobile', enrollmentData.mobile);
    formData.append('email', enrollmentData.email);

    // Append file uploads
    formData.append('adhar_card', enrollmentData.adhar_card);
    formData.append('pan_card', enrollmentData.pan_card);
    formData.append('intrest_rate', interestRate);
    formData.append('loan_amount', loanAmount);
    formData.append('tenure', tenure);
    formData.append('city', city);
    formData.append('country', country);
    formData.append('post_office_name', postOfficeName);

    try {
      const response = await axios.post('http://localhost:8000/api/enroller_client/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        console.log("the response status is ",response.status);

        setShowSuccessPopup(true); // Show success popup
         setShowDocumentPopup(false); // Close the document popup after submission

        // Optional: Reset form fields after successful submission
        setEnrollmentData({
          name: '',
          address: '',
          pincode: '',
          mobile: '',
          email: '',
          adhar_card: null,
          pan_card: null,
          intrest_rate: '',
          loan_amount: '',
          tenure: '',
          city: '',
          country: '',
          post_office_name: ''
        });

        // Automatically close success popup after 2 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error in form submission');
    }
  };

  // Handle file input change (for Aadhar and PAN cards)
  const handleFileChange = (e) => {
    setEnrollmentData({ ...enrollmentData, [e.target.name]: e.target.files?.[0] });
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
        <div className="emi-details">
          <h3>EMI Details</h3>
          <p>EMI: {emiDetails.emi}</p>
          <p>Total Amount: {emiDetails.total_amt}</p>
          <p>Interest Amount: {emiDetails.interest_amt}</p>
          <p>Principal Amount: {emiDetails.principal_amt}</p>
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
            value={enrollmentData.pincode}
            onChange={handlePincodeChange}
          />

          <div className="form-group">
            <label>City:</label>
            <input type="text" className="form-control" value={city} readOnly />
          </div>

          <div className="form-group">
            <label>Country:</label>
            <input type="text" className="form-control" value={country} readOnly />
          </div>

          <div className="form-group">
            <label>Post Office Name:</label>
            <input type="text" className="form-control" value={postOfficeName} readOnly />
          </div>

          <input
            type="number"
            placeholder="Mobile Number"
            onChange={(e) => setEnrollmentData({ ...enrollmentData, mobile: e.target.value })}
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
          <input type="file" name="adhar_card" onChange={handleFileChange} />
          <input type="file" name="pan_card" onChange={handleFileChange} />
          <button onClick={handleEnrollmentSubmit}>Submit</button>
        </div>
      )}

      {showSuccessPopup && (
        <div className="popup">
          <h3>Success</h3>
          <p>Your enrollment has been successfully submitted!</p>
          <button onClick={() => setShowSuccessPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Emicalcdashboard;
