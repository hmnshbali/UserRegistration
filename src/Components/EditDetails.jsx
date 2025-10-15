import React, { useState, useEffect } from 'react';
import { useUsers } from '../context/userContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';

const EditDetails = () => {
  const { editUser } = useUsers(); // editUser should be a function that updates user in context or state
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();

  // Redirect if no user
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Local state for the editable fields
  const [formData, setFormData] = useState({
    id: user?.id || '', // assuming you have a unique id for user
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Call editUser from context or API
    editUser(formData);

    // Navigate back or show success message
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Box
        component="form"
        onSubmit={handleSave}
        sx={{
          p: 4,
          border: '1px solid #ccc',
          borderRadius: 8,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Edit User Details
        </Typography>

        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};

export default EditDetails;
