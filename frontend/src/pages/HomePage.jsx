import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
    const { authTokens, logoutUser, user } = useContext(AuthContext);
    const [profile, setProfile] = useState([]);
    const [waitingForOpponent, setWaitingForOpponent] = useState(false);
    const navigate = useNavigate();
    // const {socket, setSocket} = useContext(DataContext)
    const socketRef = useRef()

    useEffect(() => {
        getProfile();
    }, []);

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

    const handleStart = async () => {
        const response = await fetch(`http://127.0.0.1:8000/api/games/connect?username=${user.username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        });

        const data = await response.json();

        const gameId = data.id.toString()

        socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/game/${data.id}/`);
        // socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/game/2/`);

        socketRef.current.onopen = (e) => {
            console.log('Connected to the WebSocket');
        };
      
        socketRef.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data);
        };
    
        socketRef.current.onclose = (e) => {
        console.error('WebSocket closed');
        };
    };

    // const setupSocket = () => {
    //     socket.onopen = (e) => {
    //         console.log('Connected to the WebSocket');
    //     };
      
    //     socket.onmessage = (e) => {
    //     const data = JSON.parse(e.data);
    //     console.log(data);
    //     };
    
    //     socket.onclose = (e) => {
    //     console.error('WebSocket closed');
    //     };
    // }

    return (
        <div>
            <p>Hello, {user.username}</p>
            <p>Let's start the game:</p>
            
            {!waitingForOpponent && <button onClick={handleStart}>Start</button>}
            {waitingForOpponent && <p>Waiting for opponent...</p>}
        </div>
    );
};

export default HomePage;
