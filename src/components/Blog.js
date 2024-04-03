import React, { useEffect, useState } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import Footer from './Footer';
import photo from './mainpage.png';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';


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


const defaultTheme = createTheme();

export default function Blog() {
  const navigate = useNavigate();
  const users=localStorage.getItem('users')
  console.log(users)
  const [userInput, setUserInput] = useState('');
const [messages, setMessages] = useState([]);
const [showChat, setShowChat] = useState(false);

const toggleChatWindow = () => {
    setShowChat(!showChat);
  };



  // Updated to navigate to dynamic route based on the section id
  const handleSectionClick = (id) => {
    navigate(`/view-post-grid/${id}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });
      const data = await response.json();
      setMessages([...messages, { text: userInput, fromUser: true }, { text: data.response, fromUser: false }]);
      setUserInput('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header
          title="Blog"
          sections={sections.map((section) => ({
            ...section,
            onClick: () => handleSectionClick(section.id),
          }))}
          login={localStorage.getItem('login') === 'true'}
          user={localStorage.getItem('user')}
        />
        <main>
          <div style={{ marginLeft: '24px', width: 'calc(100% - 48px)' }}>
            <img src={photo} style={{ width: '100%', height: 'auto' }} />
            <Typography variant="h5" style={{ marginTop: '16px' }}>
            Welcome to Campus Chronicles, your ultimate college blogging platform! Here, every story matters!
            </Typography>
            <br/>
            <Typography variant="body1" style={{ marginBottom: '24px' }}>
            Join us as we dive into the vibrant life of campus culture, where each blog post is a window into the diverse experiences that shape our university journey. From insightful academic discussions to the electric buzz of extracurriculars, Campus Chronicles is where your college memories are immortalized, shared, and celebrated. Let's embark on this journey of expression together, creating a tapestry of tales that resonate with the spirit of our campus community. </Typography>
            <Typography variant="body1">
            </Typography>
          </div>
          {/* Rest of your content */}
        </main>
        <section style={{ backgroundColor: '#fff' }}>
      <div className="container py-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-4">
            <div className="card" id="chat1" style={{ borderRadius: '15px' }}>
              <div className="card-header d-flex justify-content-between align-items-center p-3 bg-info text-white border-bottom-0"
                style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                {showChat ? (
                  <CloseIcon onClick={toggleChatWindow} />
                ) : (
                  <ChatIcon onClick={toggleChatWindow} />
                )}
                <p className="mb-0 fw-bold">Live chat</p>
              </div>
              {showChat && (
                <div className="card-body">
                  <div className="messages">
                    {messages.map((message, index) => (
                      <div key={index} className={message.fromUser ? 'd-flex flex-row justify-content-start mb-4' : 'd-flex flex-row justify-content-end mb-4'}>
                        {message.fromUser ? (
                          <>
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" alt="avatar 1" style={{ width: '45px', height: '100%' }} />
                            <div className="p-3 ms-3" style={{ borderRadius: '15px', backgroundColor: 'rgba(57, 192, 237,.2)' }}>
                              <p className="small mb-0">{message.text}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="p-3 me-3 border" style={{ borderRadius: '15px', backgroundColor: '#fbfbfb' }}>
                              <p className="small mb-0">{message.text}</p>
                            </div>
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp" alt="avatar 1" style={{ width: '45px', height: '100%' }} />
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="input-form">
                    <div className="form-outline mb-4">
                      <textarea
                        className="form-control"
                        id="textAreaExample"
                        rows="4"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your message"
                      ></textarea>
                      <label className="form-label" htmlFor="textAreaExample"></label>
                    </div>
                    <button type="submit" className="btn btn-primary">Send</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
      </Container>

      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </ThemeProvider>
  );
}