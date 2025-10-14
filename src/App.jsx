import React from 'react';
import { UserProvider } from './context/UserContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SignupForm from './Components/SignupForm';
import UserGrid from './Components/UserGrid';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <UserProvider>
        <SignupForm />
        <UserGrid /> 
      </UserProvider>
    </LocalizationProvider>
  );
}

export default App;
