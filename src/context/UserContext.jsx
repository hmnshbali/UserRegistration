import React, { createContext, useContext, useState } from 'react';
const UserContext = createContext();
export const useUsers = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const addUser = (user) => setUsers((prev) => [...prev, user]);
 
  const editUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };
  
  return (
    <UserContext.Provider value={{ users, addUser, editUser }}>       
      {children}
    </UserContext.Provider> 
  );
};
            