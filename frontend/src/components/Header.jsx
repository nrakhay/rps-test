import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
    let { user, logoutUser } = useContext(AuthContext)

    return (
        <div className="bg-indigo-600 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white hover:text-indigo-200 px-4 py-2 rounded transition">Home</Link>
                
                {user ? (
                    <button 
                        onClick={logoutUser} 
                        className="text-white hover:text-red-400 px-4 py-2 rounded transition cursor-pointer"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/login" className="text-white hover:text-indigo-200 px-4 py-2 rounded transition">Login</Link>
                        <Link to="/register" className="text-white hover:text-indigo-200 px-4 py-2 rounded transition">Register</Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default Header
