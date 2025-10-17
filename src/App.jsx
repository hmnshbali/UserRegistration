import React from 'react';
import { UserProvider } from './context/UserContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Routes, Route } from 'react-router-dom';

import SignupForm from './Components/SignupForm';
import UserGrid from './Components/UserGrid';
import EditDetails from './Components/EditDetails';
import TodoTaks from './Components/TodoTaks';
function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <UserProvider>
        <Routes>
          <Route path="/" element={<UserGrid />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/EditDetails" element={<EditDetails />} />
          <Route path="/TodoTaks" element={<TodoTaks />} />
        </Routes>
      </UserProvider>
    </LocalizationProvider>
  );
}

export default App;
