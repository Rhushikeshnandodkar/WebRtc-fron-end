// src/components/CreateRoom.js
import React, { useState } from "react";
import axios from "axios";

const CreateRoom = ({ onRoomCreated }) => {
    const [roomName, setRoomName] = useState("");

    const handleCreateRoom = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/rooms", {
                name: roomName,
            });
            onRoomCreated(response.data);
            setRoomName(""); // Reset input field
        } catch (error) {
            console.error("Error creating room", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />
            <button onClick={handleCreateRoom}>Create Room</button>
        </div>
    );
};

export default CreateRoom;
