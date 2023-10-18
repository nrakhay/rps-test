import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../App';
import AuthContext from '../context/AuthContext';


const HomePage = () => {
    const { authTokens, logoutUser, user } = useContext(AuthContext);
    const [profile, setProfile] = useState([]);
    const [waitingForOpponent, setWaitingForOpponent] = useState(false)
    const navigate = useNavigate();
    const { socketRef } = useContext(DataContext)
    const gameIdRef = useRef();

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

        if (response.status == 400) {
            const data = await response.json();
            alert(data.detail)
            return;
        }

        const data = await response.json();

        gameIdRef.current = data.id;

        socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/game/${data.id}/${String(authTokens.access)}/`);
        setupSocket(data.id)
        setWaitingForOpponent(true)
    };

    const setupSocket = () => {
        socketRef.current.onopen = (e) => {
            console.log('Connected to the WebSocket');
        };
      
        socketRef.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data)
            
            if (data.message === "waiting") {
                setWaitingForOpponent(true);
            } else if (data.message === "in_progress") {
                setWaitingForOpponent(false);

                navigate(`/game/${gameIdRef.current}`);
            }
        };
    
        socketRef.current.onclose = (e) => {
            console.error('WebSocket closed');
        };
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
                <p className="text-2xl text-indigo-600 font-bold mb-4">Hello, {user.username}</p>
                <p className="text-gray-700 mb-4">Welcome to Rock Paper Scissors!</p>
                <p className="text-gray-700 mb-4">Let's start the game:</p>
                
                {!waitingForOpponent && 
                    <button 
                        className="w-[40%] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300" 
                        onClick={handleStart}
                    >
                        Start
                    </button>
                }
                
                {waitingForOpponent && 
                    <p className="text-gray-500 italic">Waiting for opponent...</p>
                }
            </div>
        </div>
    );
    
};

export default HomePage;
