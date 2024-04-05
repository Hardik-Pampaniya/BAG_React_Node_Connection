import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const AllAuthors = () => {
  const [author, setAuthors] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const navigate = useNavigate();

  const handleAllBook = () => {
    navigate('/allBooks');
  };

  const handleClick = () => {
    navigate('/addAuthor');
  };

  const handleSearch = () => {
    navigate('/search');
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleEdit = (authorId) => {
    navigate('/updateBook')
    console.log('Edit author with ID:', authorId);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const handleDelete = (authorId) => {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `http://localhost:5000/deleteAuthor/${authorId}`, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log('Book deleted successfully');
      } else {
        console.error('Failed to delete author. Status:', xhr.status);
      }
    };
    xhr.onerror = function () {
      console.error('Error deleting author. Network error');
    };
    xhr.send();
  };
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.log('No token found. User is not authenticated.');
          return;
        }

        const response = await axios.get(`http://localhost:5000/allAuthors?page=${page}&pageSize=${pageSize}`, {
          headers: {
            Authorization: token,
          }
        });
        console.log(response.status, response)
        if (response.status == 404) {

          alert("No Books Found")
          return;

        }

        setAuthors(response.data.data);
      }  catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    fetchBooks();
  }, [page, pageSize]);




  return (
    <div className="container mt-5">
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <h2 className="navbar-brand">All Authors</h2>
        <div className="d-flex align-items-center">
          <Button variant="primary" onClick={handleSearch}>Search</Button>
          <Button variant="warning" className="mx-3" onClick={handleLogout}>Log Out</Button>
        </div>
      </div>
    </nav>

    <div className="d-flex justify-content-end mb-3">
      <Button variant="primary" onClick={handleClick}>Add Author</Button>
      <Button variant="primary" className="mx-3" onClick={handleAllBook}>All Books</Button>
    </div>
      <table className="table">
        <thead>
          <tr>
            <th>Author ID</th>
            <th>Name</th>
            <th>Biography</th>
            <th>Genre</th>
           
          </tr>
        </thead>
        <tbody>
          {Array.isArray(author) && author.map((author, index) => (
            <tr key={index}>
              <td>{author.author_id}</td>
              <td>{author.author_name}</td>
              <td>{author.biography}</td>
              <td>{author.genre}</td>
              <td>
                <button className="btn btn-primary btn-sm mx-2" onClick={() => handleEdit(author.author_id)}>Edit</button>
                <button className="btn btn-danger btn-sm mx-2" onClick={() => handleDelete(author.author_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <button className="btn btn-primary btn-sm" type="button" onClick={handleClick}>Add Author</button><br></br> */}
      {/* <button  variant="primary" className="btn btn-primary btn-sm" onClick={handleAllBook}>All Books</button> */}
      {/* <button className="btn btn-primary btn-sm mx-4" type="button" onClick={handleSearch}>Search</button>  */}

      <div className="d-flex justify-content-between">
        <Button variant="primary" onClick={handlePreviousPage} disabled={page === 1}>Previous Page</Button>
        <span className="mx-2">Page {page}</span>
        <Button variant="primary" onClick={handleNextPage}>Next Page</Button>
      </div>
    </div>
  );
};

export default AllAuthors;
