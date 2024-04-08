import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateBook = () => {
  const  {bookId } = useParams();
  const navigate = useNavigate();

  const [bookData, setBookData] = useState({
    title: '',
    description: '',
    published_year: '',
    quantity_available: ''
  });

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getBookById/${bookId}`);

        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }

        const data = await response.json();
       setBookData(data.data)
        
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/updateBook/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      });

      if (response.ok) {
        console.log('Book updated successfully');
        navigate('/allBooks');
      } else {
        console.error('Failed to update book. Status:', response.status);
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
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
