import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';
import './addUser.css';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  // Function to handle form field changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = () => {
    navigate('/');
  }

  const validateEmail = (email) => {
    // Regular expression for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Check if password meets minimum length requirement
    return password.length >= 8;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { password, confirmPassword, email } = formData;

    // Validate email format
    if (!validateEmail(email)) {
      alert("Invalid email address");
      return;
    }

    // Validate password length
    if (!validatePassword(password)) {
      alert("Password must be at least 8 characters long");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    // If all validations pass, proceed with registration
    try {
      const response = await axios.post('http://localhost:5000/addUser', formData);
      if (response.status >= 200) {
        console.log('Registered successfully.');
        toast.success('Registration successful'); // Show toast messag
        navigate('/');
      } else {
        console.log(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error registering user:', error.message || JSON.stringify(error));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" required className="form-control" id="name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" required className="form-control" id="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" required className="form-control" id="password" name="password" value={formData.password} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input type="password" required className="form-control" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
            </div>
            <div className='mb-3'>
              <label htmlFor="image" className="form-label">Image</label>
              <input type="file" className="form-control" id="image" name="image" value={formData.image} onChange={handleInputChange} />
            </div>

            <div className='button'>
              <button
                className="btn btn-primary btn-sm mx-1 Login"
                type="button"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                className="btn btn-primary btn-sm mx-1 Register"
                type="submit" // Change button type to submit for form submission
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;