import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const AddAuthor = () => {
  const [formData, setFormData] = useState({
    author_id: '',
    author_name: '',
    biography: '',
    genre: '', // Assuming this is the genre field for the author
  });

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/allAuthors');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('No token found. User is not authenticated.');
      }

      const response = await axios.post('http://localhost:5000/addAuthor', formData, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        console.log('Author added successfully.');
      } else {
        console.log(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error adding author:', error.message || JSON.stringify(error));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Add Author</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="authorId" className="form-label">Author ID</label>
              <input type="text" className="form-control" id="authorId" name="author_id" value={formData.author_id} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="authorName" className="form-label">Author Name</label>
              <input type="text" className="form-control" id="authorName" name="author_name" value={formData.author_name} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="biography" className="form-label">Biography</label>
              <textarea className="form-control" id="biography" name="biography" value={formData.biography} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="genre" className="form-label">Genre</label>
              <input type="text" className="form-control" id="genre" name="genre" value={formData.genre} onChange={handleInputChange} />
            </div>
            <button type="submit" className="btn btn-primary">Add Author</button>
            <button
              className="btn btn-primary btn-sm mx-4"
              type="button"
              onClick={handleClick}
            >
              Show All Authors
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAuthor;
