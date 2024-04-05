import React, { useState, useHistory } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    published_year: '',
    quantity_available: '',
    author_id: '',
    genre_id: '',
  });

  // Function to handle form field changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleClick = (e) => {
    navigate('/allBooks')
  }

  const handleSearch = () => {
    navigate('/search')
  }


  const handleSubmit = async (event) => {


    event.preventDefault();

    try {

      const token = localStorage.getItem('accessToken');
      if(!token) {
        console.log('No token found. User is not authenticated.');
      }

      const response = await axios.post('http://localhost:5000/addBook', formData, {
      headers: {
        Authorization: token
      }
    });

        if (response.status === 200) {
          console.log('Book added successfully.');
        } else {
          console.log(`Unexpected status code: ${response.status}`);
        }
      } catch (error) {
        console.error('Error registering book:', error.message || JSON.stringify(error));
      }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Register Book</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="publishedYear" className="form-label">Published Year</label>
              <input type="text" className="form-control" id="publishedYear" name="published_year" value={formData.publishedYear} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="quantityAvailable" className="form-label">Quantity Available</label>
              <input type="number" className="form-control" id="quantityAvailable" name="quantity_available" value={formData.quantityAvailable} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="authorId" className="form-label">Author ID</label>
              <input type="text" className="form-control" id="authorId" name="author_id" value={formData.authorId} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="genreId" className="form-label">Genre ID</label>
              <input type="text" className="form-control" id="genreId" name="genre_id" value={formData.genreId} onChange={handleInputChange} />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>

            <button
              className="btn btn-primary btn-sm mx-4"
              type="button"
              onClick={handleClick}
            >
              Show All Books
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
