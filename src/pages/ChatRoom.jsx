import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000"); // Connect to the server

const ChatRoom = () => {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [sender, setSender] = useState("");
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const isCaller = useRef(false);  // Track if user is caller

    useEffect(() => {
        const constraints = { video: true, audio: true };
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                localVideoRef.current.srcObject = stream;

                peerConnection.current = new RTCPeerConnection({
                    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
                });

                stream.getTracks().forEach((track) => {
                    peerConnection.current.addTrack(track, stream);
                });

                peerConnection.current.ontrack = (event) => {
                    remoteVideoRef.current.srcObject = event.streams[0];
                };

                peerConnection.current.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit("candidate", event.candidate);
                    }
                };
            })
            .catch((err) => console.error("Error accessing media devices:", err));

        socket.on("offer", async (offer) => {
            console.log("Received offer:", offer);
            isCaller.current = false;  // This user is the callee

            if (peerConnection.current.signalingState !== "stable") {
                console.warn("Ignoring offer: Connection not stable");
                return;
            }

            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socket.emit("answer", answer);
        });

        socket.on("answer", (answer) => {
            console.log("Received answer:", answer);
            if (peerConnection.current.signalingState === "have-local-offer") {
                peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
            } else {
                console.warn("Skipping setRemoteDescription: Connection is already stable");
            }
        });

        socket.on("candidate", async (candidate) => {
            if (peerConnection.current.remoteDescription) {
                try {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (error) {
                    console.error("Error adding ICE candidate:", error);
                }
            } else {
                console.warn("ICE candidate received before remote description was set. Storing candidate.");
                setTimeout(() => socket.emit("candidate", candidate), 1000);
            }
        });

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/messages/${id}`);
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages", error);
            }
        };

        fetchMessages();

        // Join the room on socket
        socket.emit("joinRoom", id);

        // Listen for incoming messages
        socket.on("receiveMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [id]);

    const createOffer = async () => {
        isCaller.current = true;  // This user is the caller
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.emit("offer", offer);
    };

    const handleSendMessage = async () => {
        if (!message || !sender) return;

        try {
            socket.emit("sendMessage", {
                id,
                sender,
                text: message,
            });
            setMessage(""); // Clear input field
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    return (
        <div>
            <div>
                <h1>WebRTC Video Call</h1>
                <button onClick={createOffer}>Start Call</button>
                <video ref={localVideoRef} autoPlay playsInline></video>
                <video ref={remoteVideoRef} autoPlay playsInline></video>
                <h2>Room ID: {id}</h2>
                <div>
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.sender}</strong>: {msg.text}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                />
                <textarea
                    placeholder="Enter your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send Message</button>
            </div>
        </div>
    );
};

export default ChatRoom;
