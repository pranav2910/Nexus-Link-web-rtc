import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import styled from "styled-components";
import './index.css'

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      
      // Input validation
      if (!email || !room) {
        setError("Please enter both Email and Room Number");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid Email");
        return;
      }

      setLoading(true);
      setError("");
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { room } = data;
      setLoading(false);
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <LobbyContainer>
      <LobbyForm onSubmit={handleSubmitForm}>
        <h1>Join a Room</h1>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        
        <label htmlFor="room">Room Number</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room number"
        />
        
        <button type="submit" disabled={loading}>
          {loading ? "Joining..." : "Join Room"}
        </button>
      </LobbyForm>
    </LobbyContainer>
  );
};

export default LobbyScreen;

// Styled Components
const LobbyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const LobbyForm = styled.form`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  width: 300px;

  h1 {
    margin-bottom: 20px;
    color: #333;
    text-align: center;
  }

  label {
    font-size: 14px;
    margin-bottom: 8px;
    color: #666;
  }

  input {
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
  }

  button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:disabled {
      background-color: #6c757d;
    }

    &:hover:not(:disabled) {
      background-color: #0056b3;
    }
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
`;
