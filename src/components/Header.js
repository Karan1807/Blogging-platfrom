import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

function Header(props) {
  const { sections, title, login, user, showDeleteButton, onDelete } = props;

  // Check if users data is available in local storage, otherwise use the default value
  const storedUsers = localStorage.getItem('users');
  const users = storedUsers ? JSON.parse(storedUsers) : [
    { "id": 1, "username": "Karan", "role": "Student", "enabled": true },
    { "id": 2, "username": "Faculty", "role": "Faculty", "enabled": true },
    { "id": 3, "username": "Staff", "role": "Staff", "enabled": false },
    { "id": 4, "username": "Moderator", "role": "Moderator", "enabled": true },
    { "id": 5, "username": "Student", "role": "Student", "enabled": false },
    { "id": 6, "username": "Admin", "role": "Admin", "enabled": true }
  ];

  const handleSectionClick = (event, onClick) => {
    event.preventDefault();
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div></div>
        <div>
          <Typography
            component="h2"
            variant="h5"
            color="inherit"
            align="center"
            noWrap
            sx={{ flex: 1 }}
          >
            {title}
          </Typography>
        </div>
        <div>
          {login ? (
            <Button component={Link} to="/" variant="outlined" size="small" onClick={() => {localStorage.setItem('login', false); localStorage.setItem('user', 'Guest');}}>
              Logout
            </Button>
          ) : (
            <Button component={Link} to="/Login" variant="outlined" size="small" onClick={() => {localStorage.setItem('users', JSON.stringify(users));}}>
              Login
            </Button>
          )}
        </div>
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
        {sections.map((section) => (
          <Button
            key={section.title}
            onClick={(event) => handleSectionClick(event, section.onClick)}
            sx={{
              p: 1,
              flexShrink: 0,
              color: section.isActive ? 'primary.main' : 'inherit', // Apply primary color if active
              fontWeight: section.isActive ? 'bold' : 'normal', // Make bold if active
              display: 'block'
            }}
          >
            {section.title}
          </Button>
        ))}
      </Toolbar>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingRight: '24px',
          gap: '8px', // Add gap between buttons
          alignItems: 'center'
        }}
      >
        <Button component={Link} to="/" variant="outlined" size="small" >Home</Button>
        <div style={{ display: 'flex', gap: '8px' }}> {/* Add gap between buttons */}
          {showDeleteButton && (
            <Button onClick={onDelete} variant="outlined" size="small">Delete</Button>
          )}
          {login ? (
            <Button component={Link} to="/create-post/:sectionId" variant="outlined" size="small">
              Create
            </Button>
          ) : null}
          {user === 'Admin' ? (
            <Button component={Link} to="/ManageUsers" variant="outlined" size="small" style={{ marginLeft: '10px' }}>
              Manage Users
            </Button>
          ) : null}
        </div>
      </Toolbar>

      <Divider sx={{ width: 'calc(100% - 48px)', marginLeft: '24px' }} />
      <br />
      <br />
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string,
      onClick: PropTypes.func,
      isActive: PropTypes.bool // New prop to track active state
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
  showDeleteButton: PropTypes.bool,
  onDelete: PropTypes.func,
  login: PropTypes.bool.isRequired,
};

export default Header;
