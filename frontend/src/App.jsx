import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import React, { createContext, useRef } from "react"
import { AuthProvider } from './context/AuthContext'

import Header from './components/Header'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

import GamePage from './pages/GamePage'
import './styles.css'
import PrivateRoute from './utils/PrivateRoute'

export const DataContext = createContext();

function App() {
  const socketRef = useRef();

  return (
    <div className="h-full">
        <DataContext.Provider value={{ socketRef }}>
          <Router>
              <AuthProvider>
                  <Header/>
                  <Routes>
                      <Route path="/" element={<PrivateRoute><HomePage/></PrivateRoute>} />
                      <Route path="/game/:gameId" element={<PrivateRoute><GamePage/></PrivateRoute>}/>
                      <Route path="/register" element={<RegisterPage/>}/>
                      <Route path="/login" element={<LoginPage/>}/>
                  </Routes>
              </AuthProvider>
          </Router>
        </DataContext.Provider>
    </div>
  );
}

export default App;
