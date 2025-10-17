import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Load users from localStorage initially
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
  }, []);

  const addUser = (user) => {
    setUsers((prev) => {
      const updatedUsers = [...prev, user];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  const editUser = (updatedUser) => {
    setUsers((prev) => {
      const updated = prev.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      localStorage.setItem('users', JSON.stringify(updated));
      return updated;
    });
  };

  const cloneUser = (user) => {
    const clonedUser = { ...user, id: Date.now() }; 
    setUsers((prev) => [...prev, clonedUser]);
  }
  const deleteUser = (id) => {
    setUsers((prev) => {
      const updated = prev.filter((user) => user.id !== id);
      localStorage.setItem('users', JSON.stringify(updated));
      return updated;
    });
  };

  const addTask = (task) => {
    setTasks((prev) => [...prev, task]);
  }

  return (
    <UserContext.Provider value={{ users, addUser, editUser, deleteUser, cloneUser, tasks, addTask ,setTasks}}>
      {children}
    </UserContext.Provider>
  );
};
