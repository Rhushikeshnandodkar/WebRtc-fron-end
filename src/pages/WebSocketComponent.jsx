import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Establish a WebSocket connection
const socket = io("http://localhost:5000");

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    // Listen for incoming messages when the component mounts
    useEffect(() => {
        socket.on("receiveMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("receiveMessage"); // Clean up when component unmounts
        };
    }, []);

    // Send message to the server
    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("sendMessage", message); // Emit the message
            setMessage(""); // Clear the input field
        }
    };

    return (
        <div>
            <h2>Chat Application</h2>
            <div>
                {/* Display messages */}
                <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
                    {messages.map((msg, index) => (
                        <p key={index}>{msg}</p>
                    ))}
                </div>
            </div>
            <div>
                {/* Input field and button to send messages */}
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
