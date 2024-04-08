import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateBook = () => {
  const  {authorId } = useParams();
  const navigate = useNavigate();

  const [authorData, setAuthorData] = useState({
    author_id: '',
    author_name: '',
    biography: '',
    genre: ''
  });

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getBookById/${authorId}`);

        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }

        const data = await response.json();
       setAuthorData(data.data)
        
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [authorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthorData({ ...authorData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/updateAuthor/${authorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(authorData)
      });

      if (response.ok) {
        console.log('Author updated successfully');
        navigate('/allAuthor');
      } else {
        console.error('Failed to update author. Status:', response.status);
      }
    } catch (error) {
      console.error('Error updating author:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="author_id" className="form-label">author_id</label>
          <input type="text" className="form-control" id="author_id" name="author_id" value={authorData.author_id} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="author_name" className="form-label">author_name</label>
          <input type="text" className="form-control" id="author_name" name="author_name" value={authorData.author_name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="biography" className="form-label">Biography</label>
          <input type="text" className="form-control" id="biography" name="biography" value={authorData.biography} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="genre" className="form-label">Genre</label>
          <input type="text" className="form-control" id="genre" name="genre" value={authorData.genre} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Update Author</button>
      </form>
    </div>
  );
};

export default UpdateBook;
