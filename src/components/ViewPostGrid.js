import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import {
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  CardActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useApi from "../hooks/useApi";

//const axios = require('axios');

//import { deletePost } from './DeletePost'; // Import the deletePost function

const defaultTheme = createTheme({
  typography: {
    // Customize typography colors here
    body1: {
      color: "#000", // Black color for body text
    },
    body2: {
      color: "#000", // Black color for secondary text
    },
    // Add more overrides as needed
  },
});

const ViewPostGrid = () => {
  const { sectionId } = useParams();

  const navigate = useNavigate();
  const [postContent, setPostContent] = useState([]);
  // const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  // const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const user = localStorage.getItem("user");
  const [posts, setPosts] = useState([]);
  // const [deletedPosts, setDeletedPosts] = useState([]);
  // const [query, setQuery] = useState("");
  // const [searchResults, setSearchResults] = useState([]);
  const { fetchPosts } = useApi();

  useEffect(() => {
    const data = fetchPosts();
    data.then((response) => {
      setPosts(response);
    });
  }, [navigate, sectionId, deleteSuccess]);

  // Define sections state and setter
  const [sections, setSections] = useState([
    { title: "Academic Resources", id: "academic-resources" },
    { title: "Career Services", id: "career-services" },
    { title: "Campus", id: "campus" },
    { title: "Culture", id: "culture" },
    { title: "Local Community Resources", id: "local-community-resources" },
    { title: "Social", id: "social" },
    { title: "Sports", id: "sports" },
    { title: "Health and Wellness", id: "health-and-wellness" },
    { title: "Technology", id: "technology" },
    { title: "Travel", id: "travel" },
    { title: "Alumni", id: "alumni" },
  ]);

  useEffect(() => {
    const filteredPosts = posts.filter(
      (posts) => posts._source.topic === sectionId
    );
    setPostContent(filteredPosts);

    // Update isActive property based on the sectionId
    const updatedSections = sections.map((section) => ({
      ...section,
      isActive: section.id === sectionId,
    }));
    setSections(updatedSections);
  }, [sectionId]);

  const navigateHome = () => {
    navigate("/");
  };

  const navigateToCreatePost = () => {
    navigate("/create-post");
  };

  const handleCardClick = (postId) => {
    const post = posts.find((post) => post._id === postId);
    console.log("post id:", postId);
    if (post) {
      navigate(`/content/${post._id}`);
    } else {
      console.error(`Post with ID ${postId} not found`);
    }
  };

  // Function to handle deletion of a post
  async function handleDelete(postId) {
    try {
      await fetch("http://localhost:3001/api/deletepost", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      }).then(() => {
        setDeleteSuccess(true);
        const updatedPosts = posts.filter((post) => post._id !== postId);
        setPosts(updatedPosts);
        const updatedPostContent = postContent.filter(
          (post) => post._id !== postId
        );
        setPostContent(updatedPostContent);
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      // You can handle network errors or other exceptions here
    }
  }

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Header
            title="Blog"
            sections={sections.map((section) => ({
              ...section,
              onClick: () => {
                navigate(`/view-post-grid/${section.id}`);
              },
            }))}
            login={localStorage.getItem("login") === "true"}
            user={localStorage.getItem("user")}
            extra={
              <>
                <Button color="inherit" onClick={navigateHome}>
                  Home
                </Button>
                <Button color="inherit" onClick={navigateToCreatePost}>
                  Create
                </Button>
              </>
            }
          />
          <main>
            {postContent.length > 0 ? (
              postContent.map((post, index) => (
                <Card
                  style={{
                    margin: "20px",
                    position: "relative",
                    borderRadius: "8px",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  <Link
                    key={post._id}
                    to={`/content/${post._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={() => handleCardClick(post._id)}
                  >
                    <CardContent
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <Typography
                          variant="h5"
                          component="h2"
                          style={{
                            fontWeight: "bold",
                            marginBottom: "8px",
                            color: "#1DA1F2",
                          }}
                        >
                          {post._source.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{ marginBottom: "4px" }}
                        >
                          @{post._source.author} · {post.createdDate}
                        </Typography>
                        <Typography
                          variant="body2"
                          component="p"
                          style={{ color: "#000" }}
                        >
                          {post._source.shortdescription}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{ marginBottom: "4px" }}
                        >
                          ID: {post._id}
                        </Typography>
                      </div>
                    </CardContent>
                  </Link>
                  <CardActions
                    style={{ position: "absolute", top: "5px", right: "5px" }}
                  >
                    {user === "Moderator" && (
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(post._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography variant="body1">
                No content available for this section.
              </Typography>
            )}
          </main>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default ViewPostGrid;
