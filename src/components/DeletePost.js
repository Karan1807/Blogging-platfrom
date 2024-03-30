// src/services/postService.js

export async function deletePost(postId) {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
  
      return true; // Return true if deletion is successful
    } catch (error) {
      console.error('Error deleting post:', error);
      return false; // Return false if deletion fails
    }
  }
  