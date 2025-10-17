import React, { useState } from 'react';
import { useUsers } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

const UserGrid = () => {
    const { users, cloneUser, deleteUser } = useUsers();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleClickOpen = (userId) => {
        setSelectedUserId(userId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUserId(null);
    };

    const handleConfirmDelete = () => {
        if (selectedUserId) {
            deleteUser(selectedUserId);
        }
        handleClose();
    };

    return (
        <>
            {/* Delete Confirmation Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom textAlign="center">
                        User Details
                    </Typography>
                    <div style={{ display: 'flex', gap: '10px', mt: 2 }}>
                       <Button variant="contained" color="primary" onClick={() => navigate('/signup')}>
                        Add New User
                    </Button>

                    <Button variant="contained" color="primary" onClick={() => navigate('/TodoTaks')}>
                        Todo Taks
                    </Button>



                    </div>
                   
                </Box>

                <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 2, overflowX: 'auto' }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Password</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>DOB</TableCell>
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
                                    <TableRow key={user.id} hover sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                                        <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.password}</TableCell>
                                        <TableCell>{user.gender}</TableCell>
                                        <TableCell>{user.dob ? dayjs(user.dob).format('DD-MM-YYYY') : 'N/A'}</TableCell>
                                        <TableCell>{user.profileType}</TableCell>
                                        <TableCell>{user.phoneNumbers?.join(', ') || 'N/A'}</TableCell>
                                        <TableCell>
                                            {user.addresses?.map((address, index) => (
                                                <div key={index}>
                                                    {`${address.street}, ${address.city}, ${address.state}, ${address.zip}`}
                                                </div>
                                            )) || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {user.relatives?.map((relative, index) => (
                                                <div key={index}>
                                                    {`${relative.name}, ${relative.relationship}, ${relative.age} years`}
                                                </div>
                                            )) || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => navigate('/EditDetails', { state: { user } })}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => cloneUser(user)}
                                                >
                                                    Clone
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleClickOpen(user.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                                        No users available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    );
};

export default UserGrid;
