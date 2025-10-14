import React, { createContext, useContext, useState } from 'react';
const UserContext = createContext();
export const useUsers = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const addUser = (user) => setUsers((prev) => [...prev, user]);
 

  return (
    <UserContext.Provider value={{ users, addUser}}>       
      {children}
    </UserContext.Provider>
  );
};
