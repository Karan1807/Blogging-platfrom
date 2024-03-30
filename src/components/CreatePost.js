// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from './Header';
// import CssBaseline from '@mui/material/CssBaseline';
// import Container from '@mui/material/Container';
// import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// const sections = [
//   { title: 'Academic Resources', id: 'academic-resources' },
//   { title: 'Career Services', id: 'career-services' },
//   { title: 'Campus', id: 'campus' },
//   { title: 'Culture', id: 'culture' },
//   { title: 'Local Community Resources', id: 'local-community-resources' },
//   { title: 'Social', id: 'social' },
//   { title: 'Sports', id: 'sports' },
//   { title: 'Health and Wellness', id: 'health-and-wellness' },
//   { title: 'Technology', id: 'technology' },
//   { title: 'Travel', id: 'travel' },
//   { title: 'Alumni', id: 'alumni' },
// ];

// const defaultTheme = createTheme();

// const CreatePost = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     topic: '',
//     content: '',
//     author: '',
//     shortdescription: '',
//     replies: []
//   });
//   const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility

//   const handleSectionClick = (id) => {
//     navigate(`/view-post-grid/${id}`);
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleContentChange = (content) => {
//     setFormData({ ...formData, content });
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     console.log(formData, "Details")
//     const currentDate = new Date();
//     const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}-${currentDate.getFullYear()}`; // Format: YYYY-MM-DD
//     const { title, topic, content, author, shortdescription, replies } = formData;

//     const response = await fetch('http://localhost:3001/posts', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ title, topic, content, author, shortdescription, createdDate: formattedDate, replies: [] }),
//     });

//     if (response.ok) {
//       console.log('Post added successfully');
//       setDialogOpen(true); // Open the dialog if post added successfully
//     } else {
//       console.error('Failed to add post');
//     }
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false); // Close the dialog
//     navigate(`/view-post-grid/${formData.topic}`); // Navigate to the home page
//   };

//   const navigateHome = () => {
//     navigate('/');
//   };

//   const centerButtonStyle = {
//     display: 'flex',
//     justifyContent: 'center',
//     marginTop: '20px', // Add margin to separate the button from the form
//   };

//   const modules = {
//     toolbar: [
//       [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
//       [{ 'size': [] }],
//       ['bold', 'italic', 'underline'],
//       [{ 'color': [] }, { 'background': [] }],
//       [{ 'align': [] }],
//       ['clean'],
//     ],
//   };

//   const editorStyle = {
//     height: '250px', // Adjust the height as needed
//   };

//   const formStyle = {
//     marginBottom: '50px', // Add margin to create gap between editor and button
//   };

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <CssBaseline />
//       <Container maxWidth="lg">
        
//         <main>
//         <div style={{ ...formStyle, backgroundColor: '#f5f8fa', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//   <form onSubmit={handleFormSubmit}>
//     <div style={{ ...centerButtonStyle, marginBottom: '20px' }}>
//       <Typography variant="h4" style={{ fontWeight: 700, color: '#1da1f2' }}>Create New Blog</Typography>
//     </div>
//     <TextField
//       name="title"
//       label="Title?"
//       fullWidth
//       value={formData.title}
//       onChange={handleInputChange}
//       margin="normal"
//       required
//       variant="outlined"
//       InputLabelProps={{
//         shrink: true,
//       }}
//       style={{ backgroundColor: '#fff', borderRadius: '4px' }}
//     />
//     <FormControl fullWidth margin="normal" variant="outlined" style={{ backgroundColor: '#fff', borderRadius: '4px' }}>
//       <InputLabel id="topic-label">Topic</InputLabel>
//       <Select
//         labelId="topic-label"
//         id="topic"
//         name="topic"
//         value={formData.topic}
//         onChange={handleInputChange}
//         required
//         style={{ textAlign: 'left' }}
//       >
//         {sections.map((section) => (
//           <MenuItem key={section.id} value={section.id}>{section.title}</MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//     <TextField
//       name="author"
//       label="Author"
//       fullWidth
//       value={formData.author}
//       onChange={handleInputChange}
//       margin="normal"
//       required
//       variant="outlined"
//       InputLabelProps={{
//         shrink: true,
//       }}
//       style={{ backgroundColor: '#fff', borderRadius: '4px' }}
//     />
//     <TextField
//       name="shortdescription"
//       label="Short Description"
//       fullWidth
//       value={formData.shortdescription}
//       onChange={handleInputChange}
//       margin="normal"
//       required
//       multiline
//       rows={3}
//       variant="outlined"
//       InputLabelProps={{
//         shrink: true,
//       }}
//       style={{ backgroundColor: '#fff', borderRadius: '4px' }}
//     />
//     <ReactQuill
//       value={formData.content}
//       onChange={handleContentChange}
//       modules={modules}
//       formats={['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'color', 'align']}
//       theme="snow"
//       style={{ ...editorStyle, backgroundColor: '#fff', borderRadius: '4px', marginTop: '20px' }}
//     />
//     <div style={{ ...centerButtonStyle, marginTop: '30px' }}>
//       <Button type="submit" variant="contained" style={{ backgroundColor: '#1da1f2', color: '#fff' }}>
//         Post
//       </Button>
//     </div>
//   </form>
// </div>
// {/* Dialog for post creation success */}
// <Dialog
//   open={dialogOpen}
//   onClose={handleCloseDialog}
//   aria-labelledby="alert-dialog-title"
//   aria-describedby="alert-dialog-description"
// >
//   <DialogTitle id="alert-dialog-title">{"Post Created Successfully!"}</DialogTitle>
//   <DialogContent>
//     <DialogContentText id="alert-dialog-description">
//       Your post has been created successfully.
//     </DialogContentText>
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={handleCloseDialog} autoFocus>
//       OK
//     </Button>
//   </DialogActions>
// </Dialog>

//         </main>
//       </Container>
      
//     </ThemeProvider>
//   );
// };

// export default CreatePost;
// CreatePost.js
import React, { useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const sections = [
  { title: 'Academic Resources', id: 'academic-resources' },
  { title: 'Career Services', id: 'career-services' },
  { title: 'Campus', id: 'campus' },
  { title: 'Culture', id: 'culture' },
  { title: 'Local Community Resources', id: 'local-community-resources' },
  { title: 'Social', id: 'social' },
  { title: 'Sports', id: 'sports' },
  { title: 'Health and Wellness', id: 'health-and-wellness' },
  { title: 'Technology', id: 'technology' },
  { title: 'Travel', id: 'travel' },
  { title: 'Alumni', id: 'alumni' },
];

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    author: '',
    shortdescription: '',
    description: '',
  
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    try {
      const response = await fetch('http://localhost:3001/api/createposts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        console.log('Post added successfully');
        // Show success message
        window.alert("Post created successfully");
        // Redirect to the main page (blog page)
        window.location.href = "/view-post-grid/${formData.topic}"; // Replace "/blog" with the actual URL of your blog page
      } else {
        console.error('Failed to add post');
        // Handle error scenarios
      }
    } catch (error) {
      console.error('Error occurred while adding post:', error);
      // Handle error scenarios
    }
  };
  

  
  return (
    <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #000000', maxWidth: '600px', margin: 'auto', marginTop: '20px' }}>
  <Typography variant="h4" style={{ fontWeight: 400, color: '#1da1f2', marginBottom: '20px' }}>Create  Post</Typography>
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
        style: { fontSize: '1.2rem', fontWeight: 400, color: '#111111' }
      }}
    />
    <FormControl fullWidth margin="normal" variant="outlined">
      <InputLabel id="topic-label" style={{color: '#000000', marginBottom: '20px' }}>Select Topic</InputLabel>
      <Select
        labelId="topic-label"
        id="topic"
        name="topic"
        value={formData.topic}
        onChange={handleInputChange}
        required
        style={{ fontSize: '1.2rem', color: '#111111', fontWeight: 400 }}
      >
        {sections.map((section) => (
          <MenuItem key={section.id} value={section.id} style={{ fontSize: '1.2rem', color: '#111111', fontWeight: 400 }}>{section.title}</MenuItem>
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
        style: { fontSize: '1.2rem', fontWeight: 400, color: '#111111' }
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
        style: { fontSize: '1.2rem', fontWeight: 400, color: '#111111' }
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
        style: { fontSize: '1.2rem', fontWeight: 400, color: '#111111' }
      }}
    />
    <Button type="submit" variant="contained" style={{ backgroundColor: '#1da1f2', color: '#fff', marginTop: '20px', fontWeight: 700 }}>Post</Button>
  </form>
</div>


  );
};

export default CreatePost;
 