import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
    const { authTokens, logoutUser, user } = useContext(AuthContext);
    const [profile, setProfile] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        getProfile()
    },[])

    const getProfile = async() => {
        let response = await fetch('http://127.0.0.1:8000/api/profile', {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' + String(authTokens.access)
        }
        })
        let data = await response.json()
        console.log(data)
        if(response.status === 200){
            setProfile(data)
        } else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
    }

    const handleStart = () => {
        navigate("/game")
    }

    return (
        <div>
            <p>Hello, {user.username}</p>
            <p>Let's start the game:</p>
            <button onClick={handleStart}>Start</button>
        </div>
    )
}

export default HomePage