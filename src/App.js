// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Blog from './components/Blog';
import Login from './components/authentication/Login';
import ManageUsers from './components/authentication/manageUsers';
import ViewPostGrid from './components/ViewPostGrid';
import CreatePost from './components/CreatePost';
import Content from './components/Content'; // Import the Content component
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/view-post-grid/:sectionId" element={<ViewPostGrid />} />
        <Route path="/content/:postId" element={<Content />} /> {/* Add this route */}
        <Route path="/create-post/:sectionId" element={<CreatePost />} />
        <Route path="/ManageUsers" element={<ManageUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
