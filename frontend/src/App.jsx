import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'

import Header from './components/Header'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

import GamePage from './pages/GamePage'
import PrivateRoute from './utils/PrivateRoute'


function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
