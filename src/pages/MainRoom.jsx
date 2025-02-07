// src/App.js
import React, { useState } from "react";
import CreateRoom from "./CreateRoom";
import ChatRoom from "./ChatRoom";

const MainRoom = () => {
    const [room, setRoom] = useState(null);

    // This function will be passed to CreateRoom as onRoomCreated
    const handleRoomCreated = (roomData) => {
        setRoom(roomData); // Set room after creation
    };

    return (
        <div>
            <h1>Chat Application</h1>
            {!room ? (
                // Pass the handleRoomCreated function to CreateRoom
                <CreateRoom onRoomCreated={handleRoomCreated} />
            ) : (
                <ChatRoom roomId={room._id} />
            )}
        </div>
    );
};

export default MainRoom;
