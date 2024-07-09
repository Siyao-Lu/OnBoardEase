import React from 'react';
// import './App.css';
import AppRoutes from './routes';
import UserProvider from './context/UserContext';

const App = () => {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
};

export default App;
