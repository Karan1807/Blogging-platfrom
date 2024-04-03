
import React, { useState, useEffect,useContext} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Switch from '@mui/material/Switch';
import { Grid, TextField } from '@mui/material';


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




const defaultTheme = createTheme({
  typography: {
    body1: {
      color: "#000", // Black color for body text
    },
    body2: {
      color: "#000", // Black color for secondary text
    },
  },
});


const ViewPostGrid = (props) => {
  
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState([]);
  const [user, setUser] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { fetchPosts } = useApi();
  const [loading, setLoading] = useState(false);
  console.log("props of view post grid",props.subscriptionChecker)
  const [isSubscribed, setIsSubscribed] = useState(props.subscriptionChecker.isSubscribed);

 

  const handleSubscriptionToggle = () => {
    setIsSubscribed((prevState) => !prevState);
    console.log(isSubscribed)
    if(isSubscribed===true){
      props.subscriptionCheckerHandler(true,sectionId)
    }
    if(isSubscribed===false){
      props.subscriptionCheckerHandler(false,sectionId)
    }
    if (!isSubscribed) {
      handleSubscription();
    }
    // You can also add logic to handle unsubscription here if needed
  };

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const loggedInUser = users.find(u => u.username === localStorage.getItem('user'));
      setUser(loggedInUser);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };

    fetchData();
  }, [deleteSuccess]);

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
      (post) => post._source.topic === sectionId
    );
    setPostContent(filteredPosts);

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
    if (post) {
      navigate(`/content/${post._id}`);
   
    } else {
      console.error(`Post with ID ${postId} not found`);
    }
  };
  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: '#f9f9f9',
  };
  
  const headerStyle = {
    marginBottom: '8px',
  };
  
  const authorStyle = {
    fontSize: '14px',
    color: '#555',
  };
  
  const descriptionStyle = {
    fontSize: '16px',
  };
  

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
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, topic }),
      });
      const data = await response.json();
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      console.error('Error occurred while searching:', error);
      setLoading(false);
    }
  };

  const handleSubscription = async () => {
    try {
      const email = window.prompt("Please enter your email to subscribe to this topic:");
      if (email) {
        await fetch('http://localhost:3001/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic: sectionId,
            email: email,
            userId: user.id
          }),
        });
        alert('Subscription successful!');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Error subscribing. Please try again later.');
    }
  };

    const toggleSubscription = () => {
      setIsSubscribed(prevState => !prevState);
    };
  

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
              <Grid
      container
      spacing={2}
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      style={{ minHeight: '0vh' }}
    >
      <Grid item style={{ marginTop: '20px' }}>
        <TextField
          type="text"
          label="Enter search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Grid>
    </Grid>

          
          <main>
          {/* Toggle button for subscription */}
          <Switch
                  key={sectionId}
                  checked={props.subscriptionChecker.sectionId===sectionId?isSubscribed:false}
                  onChange={handleSubscriptionToggle}
                  color="primary"
                  name="subscriptionToggle"
                  inputProps={{ 'aria-label': 'toggle subscription' }}
                />
                {props.subscriptionChecker.sectionId===sectionId?(isSubscribed ? 'Unsubscribe' : 'Subscribe'):'Subscribe'}
           
                <div>
  {searchResults.map((result, index) => (
    <div key={index} style={cardStyle}>
      <div style={headerStyle}>
        <h2>{result._source.title}</h2>
        <p style={authorStyle}>Author: {result._source.author}</p>
      </div>
      <p style={descriptionStyle}>Description: {result._source.description}</p>
    </div>
  ))}
</div>
            {postContent.length > 0 ? (
              postContent.map((post, index) => (
                <Card
                  key={index}
                  style={{
                    margin: "20px",
                    position: "relative",
                    borderRadius: "8px",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  <Link
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
                    {user && user.role === "Moderator" && (
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
