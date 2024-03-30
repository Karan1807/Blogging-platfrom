import React, { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>Topic: {post.topic}</p>
            <p>Author: {post.author}</p>
            <p>Description: {post.desc}</p>
            <p>Short Description: {post.shortdesc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;
