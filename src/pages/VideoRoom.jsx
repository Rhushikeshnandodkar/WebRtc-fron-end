import React, { useRef, useEffect } from "react";
import { io } from "socket.io-client";
const VideoRoom = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null); // Store peer connection
  const socket = useRef(null)
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  useEffect(() => {
    socket.current = io("http://localhost:5000")
    async function setupWebRTC() {
      // Create Peer Connection
      peerConnection.current = new RTCPeerConnection(configuration);
      // Get local stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream; // Show local video
        }
        
        // Add local stream to Peer Connection
        stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }

      // Handle incoming remote stream
      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]; // Show remote video
        }
      };
      peerConnection.current.onicecandidate = (event) =>{
        if(event.candidate) {
            socket.current.emit("ice_candidate", { candidate: event.candidate });
          }
        };
    }

    socket.current.on("offer", async(offer) =>{
        console.log("recived offer", offer)
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.current.emit("answer", answer);
    })

    socket.current.on("answer", async (answer) => {
        if (!peerConnection.current.currentRemoteDescription) {  // Prevent setting twice
          console.log("Received answer:", answer);
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        } else {
          console.warn("Skipping duplicate answer...");
        }
      });

    socket.current.on("ice-candidate", (candidate) =>{
        console.log("candidate recived", candidate)
    })

    setupWebRTC();
  }, []);

  const startCall = async () =>{
    const offer = await peerConnection.current.createOffer()
    await peerConnection.current.setLocalDescription(offer)
    socket.current.emit("offer", offer)
  }
  return (
    <div>
      <h2>Local Video</h2>
      <video ref={localVideoRef} autoPlay playsInline />
      
      <h2>Remote Video</h2>
      <video ref={remoteVideoRef} autoPlay playsInline />

      <button onClick={startCall}>Start Call</button>
    </div>
  );
};

export default VideoRoom;
