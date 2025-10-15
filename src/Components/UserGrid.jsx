import React from 'react';
import { useUsers } from '../context/userContext';
import { useNavigate } from 'react-router-dom'; 
import EditDetails from './EditDetails';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  Box,
  Button,
} from '@mui/material';
import dayjs from 'dayjs';

const UserGrid = () => {
  const { users } = useUsers();
  const navigate = useNavigate();
  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          gutterBottom
          textAlign="center"
        >
          User Details
        </Typography>

   
                <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/signup')}
        >
          Add New User
        </Button>
              </Box>

      <TableContainer
        component={Paper}
        elevation={4}
        sx={{
          borderRadius: 2,
          overflowX: 'auto',
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Password</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date of Birth</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Profile Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Addresses</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Relatives</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  key={user.email}
                  hover
                  sx={{
                    '&:hover': { backgroundColor: '#f9fafb' },
                  }}
                >
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.password}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>
                    {user.dob ? dayjs(user.dob).format('YYYY-MM-DD') : 'N/A'}
                  </TableCell>
                  <TableCell>{user.profileType}</TableCell>
                  <TableCell>{user.phoneNumbers?.join(', ') || 'N/A'}</TableCell>
                    <TableCell>
                      {user.addresses?.map((address, index) => (
                        <div key={index}>
                          {`${address.street}, ${address.city}, ${address.state}, ${address.postalCode}`}
                        </div>
                      )) || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {user.relatives?.map((relative, index) => (
                        <div key={index}>
                          {`${relative.name}, ${relative.relationship}`}
                        </div>
                      )) || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/EditDetails', { state: { user } })}
                      >
                        Edit
                      </Button>
                    </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  No users available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UserGrid;
