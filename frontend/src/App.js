import React from 'react';
import { Route, Routes, ProtectedRoute } from 'react-router-dom';
import Search from '../src/components/Search';
import Login from '../src/components/Login';
import AddBook from './components/AddBook';
import AllBook from './components/AllBook';
import UpdateBook from './components/UpdateBook';
import AllAuthors from './components/AllAuthor';
import AddUser from './components/Register';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/search" element={<Search />} />
      <Route path="/addBook" element={<AddBook/>}/>
      <Route path="/allBooks" element={<AllBook/>}/>
      <Route path="/updateBook/:bookId" element={<UpdateBook/>}/>
      <Route path="/allAuthors" element={<AllAuthors/>}/>
      <Route path="/addUser" element={<AddUser/>}/>
    </Routes>
  );
}

export default App;
