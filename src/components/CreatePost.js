import React, { useState ,useContext} from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";




const sections = [
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
];
const CreatePost = (props) => {

  const checker = props.subscriptionChecker


  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    author: "",
    shortdescription: "",
    description: "",
  });
  console.log(checker.isSubscribed);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    try {
      const response = await fetch("http://localhost:3001/api/createposts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Post added successfully");
        // Show success message
        window.alert("Post created successfully");
        // Redirect to the main page (blog page)

       
        if(!checker.isSubscribed){
          await fetch("http://localhost:3001/api/send-emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic: formData.topic }),
          });
        }
        navigate(`/view-post-grid/${formData.topic}`);
      } else {
        console.error("Failed to add post");
        // Handle error scenarios
      }
    } catch (error) {
      console.error("Error occurred while adding post:", error);
      // Handle error scenarios
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid #000000",
        maxWidth: "600px",
        margin: "auto",
        marginTop: "20px",
      }}
    >
      <Typography
        variant="h4"
        style={{ fontWeight: 400, color: "#1da1f2", marginBottom: "20px" }}
      >
        Create Post
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <TextField
          name="title"
          label="Title"
          fullWidth
          value={formData.title}
          onChange={handleInputChange}
          margin="normal"
          required
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: { fontSize: "1.2rem", fontWeight: 400, color: "#111111" },
          }}
        />
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel
            id="topic-label"
            style={{ color: "#000000", marginBottom: "20px" }}
          >
            Select Topic
          </InputLabel>
          <Select
            labelId="topic-label"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
            required
            style={{ fontSize: "1.2rem", color: "#111111", fontWeight: 400 }}
          >
            {sections.map((section) => (
              <MenuItem
                key={section.id}
                value={section.id}
                style={{
                  fontSize: "1.2rem",
                  color: "#111111",
                  fontWeight: 400,
                }}
              >
                {section.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          name="author"
          label="Your Name"
          fullWidth
          value={formData.author}
          onChange={handleInputChange}
          margin="normal"
          required
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: { fontSize: "1.2rem", fontWeight: 400, color: "#111111" },
          }}
        />
        <TextField
          name="shortdescription"
          label="Short Description (Optional)"
          fullWidth
          value={formData.shortdescription}
          onChange={handleInputChange}
          margin="normal"
          multiline
          rows={3}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: { fontSize: "1.2rem", fontWeight: 400, color: "#111111" },
          }}
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          value={formData.description}
          onChange={handleInputChange}
          margin="normal"
          required
          multiline
          rows={5}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: { fontSize: "1.2rem", fontWeight: 400, color: "#111111" },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          style={{
            backgroundColor: "#1da1f2",
            color: "#fff",
            marginTop: "20px",
            fontWeight: 700,
          }}
        >
          Post
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
