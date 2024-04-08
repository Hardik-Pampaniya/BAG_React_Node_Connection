import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AllBook.css'; // Custom CSS for styling
import CookieMessage from './CookieMessage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllBook = () => {
  const [profile, setProfile] = useState(null)
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const navigate = useNavigate();

  const handleAllAuthors = () => {
    navigate('/allAuthors');
  };

  const handleClick = () => {
    navigate('/addBook');
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

  const handleEdit = (bookId) => {
    navigate(`/updateBook/${bookId}`);
  };
  

  const handleDelete = async (bookId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this book?");
      if (confirmDelete) {
        await axios.delete(`http://localhost:5000/deleteBook/${bookId}`);
        setBooks(books.filter(book => book.book_id !== bookId));
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };
  
  

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
    toast.success('You have been logged out successfully!', {
      position: "top-right" // Specify the position directly as a string
    });
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('accessToken');
       

        const response = await axios.get(`http://localhost:5000/allBooks?page=${page}&pageSize=${pageSize}`, {
          headers: {
            Authorization: token,
          }
        });

        if (response.status === 404) {
          alert("No Books Found");
          return;
        }

        setBooks(response.data.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
    
  }, [page, pageSize]);

  useEffect(()=>{
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
     

      const response = await axios.get(`http://localhost:5000/profile`, {
        headers: {
          Authorization: token,
        }
      });

      if (response.status === 404) {
        alert("No Books Found");
        return;
      }

      setProfile(response.data.user);
      
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <h2 className="navbar-brand">All Books</h2>
          <div className="d-flex align-items-center">
            <Button variant="primary" onClick={handleSearch}>Search</Button>
            <img src={`http://localhost:5000/public/profilePics/${profile?.image}`} alt='profile' height={50} width={50} class="rounded-circle"/>
            <Button variant="warning" className="mx-3" onClick={handleLogout}>Log Out</Button>
          </div>
        </div>
      </nav>

      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleClick}>Add Book</Button>
        <Button variant="primary" className="mx-3" onClick={handleAllAuthors}>All Authors</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Published Year</th>
            <th>Quantity Available</th>
            <th>Author Name</th>
            <th>Genre ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.book_id}>
              <td>{book.book_id}</td>
              <td>{book.title}</td>
              <td>{book.description}</td>
              <td>{book.published_year}</td>
              <td>{book.quantity_available}</td>
              <td>{book.author_name}</td>
              <td>{book.genre_id}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(book.book_id)}>Edit</Button>
                <Button variant="danger" className="mx-2" onClick={() => handleDelete(book.book_id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between">
        <Button variant="primary" onClick={handlePreviousPage} disabled={page === 1}>Previous Page</Button>
        <span className="mx-2">Page {page}</span>
        <Button variant="primary" onClick={handleNextPage}>Next Page</Button>
      </div>

      <div className="container mt-5">
      <CookieMessage /> {/* Render the CookieMessage component */}
      {/* Rest of your component code... */}
    </div>
    </div>
  );
};

export default AllBook;
