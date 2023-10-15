import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import React, { createContext, useState } from "react"
import { AuthProvider } from './context/AuthContext'

import Header from './components/Header'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

import GamePage from './pages/GamePage'
import PrivateRoute from './utils/PrivateRoute'

export const DataContext = createContext();

function App() {
  const [socket, setSocket] = useState(null);

  return (
    <div className="App">
        <DataContext.Provider value={{socket, setSocket }}>
          <Router>
              <AuthProvider>
                  <Header/>
                  <Routes>
                      <Route path="/" element={<PrivateRoute><HomePage/></PrivateRoute>} />
                      <Route path='/game' element={<PrivateRoute><GamePage/></PrivateRoute>}/>
                      <Route path="/login" element={<LoginPage/>}/>
                  </Routes>
              </AuthProvider>
          </Router>
        </DataContext.Provider>
    </div>
  );
}

export default App;
