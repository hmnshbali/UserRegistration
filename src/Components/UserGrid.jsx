import React from 'react'
import { useUsers } from '../context/UserContext';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button
} from '@mui/material';
import dayjs from 'dayjs';

const UserGrid = () => {
    const { users, addUser } = useUsers();
    console.log(users);

    return (
        <>
            <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Password</TableCell>
                                <TableCell>Gender</TableCell>
                                <TableCell>Date of Birth</TableCell>
                                <TableCell>Profile Type</TableCell>
                                <TableCell>Phone Number</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.email}>
                                    <TableCell>{user.firstName + ' ' + user.lastName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.password}</TableCell>
                                    <TableCell>{user.gender}</TableCell>
                                    <TableCell>
                                        {user.dob ? dayjs(user.dob).format('YYYY-MM-DD') : 'N/A'}
                                    </TableCell>
                                    <TableCell>{user.profileType}</TableCell>
                                    <TableCell>{user.phoneNumbers.join(', ')}</TableCell>
                                    
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}

export default UserGrid