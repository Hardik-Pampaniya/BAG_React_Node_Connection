import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const UpdateBook = () => {
  const { id } = useParams();
  console.log(id)
  const navigate = useNavigate();
  // const location = useLocation();
  const [bookData, setBookData] = useState({
    book_id: '',
    title: '',
    description: '',
    published_year: '',
    quantity_available: '',
    author_id: '',
    genre_id: ''
  }); 

  // useEffect(() => {
  //   if (location.state && location.state.bookData) {
  //     setBookData(location.state.bookData);
  //   }
  // }, [location.state]);

  useEffect(() => {
    const fetchBookDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/bookbyid/${id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch book details');
            }

            const data = await response.json();
            const resBookData = data.data[0];
            console.log(data,resBookData);

            setBookData({
                title: resBookData.title,
                description: resBookData.description,
                published_year: resBookData.published_year,
                quantity_available: resBookData.quantity_available,
            });
        } catch (error) {
            console.error('Error fetching book details:', error);
        }
    };

    fetchBookDetails();
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `http://localhost:5000/updateBook/${id}`, true); 
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log('Book updated successfully');
        navigate('/allBooks');
      } else {
        console.error('Failed to update book. Status:', xhr.status);
      }
    };
    xhr.onerror = function () {
      console.error('Error updating book. Network error');
    };
    xhr.send(JSON.stringify(bookData));
  };

  return (
    <div className="container mt-5">
      <h2>Update Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" className="form-control" id="title" name="title" value={bookData.title} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" className="form-control" id="description" name="description" value={bookData.description} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="published_year" className="form-label">Published Year</label>
          <input type="text" className="form-control" id="published_year" name="published_year" value={bookData.published_year} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="quantity_available" className="form-label">Quantity Available</label>
          <input type="text" className="form-control" id="quantity_available" name="quantity_available" value={bookData.quantity_available} onChange={handleChange} />
        </div>
        
        <button type="submit" className="btn btn-primary">Update Book</button>
      </form>
    </div>
  );
};

export default UpdateBook;
