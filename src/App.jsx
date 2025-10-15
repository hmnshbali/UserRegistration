import React from 'react';
import { UserProvider } from './context/userContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Routes, Route } from 'react-router-dom';

import SignupForm from './Components/SignupForm';
import UserGrid from './Components/UserGrid';
import EditDetails from './Components/EditDetails';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <UserProvider>
        <Routes>
          <Route path="/" element={<UserGrid />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/EditDetails" element={<EditDetails />} />
        </Routes>
      </UserProvider>
    </LocalizationProvider>
  );
}

export default App;
