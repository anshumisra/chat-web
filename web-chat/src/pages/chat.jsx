import { useEffect, useState } from 'react'
import { io } from "socket.io-client"
import { Link } from "react-router-dom"
import ButtonCustom from "../components/ui/buttons";
import { useLocation } from 'react-router-dom';
import { Send, Users } from 'lucide-react';
import ChatBox from '../components/ui/chatBox';
import socketImage from '../assets/io.svg';

let socket;

function Chat() {
  const location = useLocation();
  const { userName } = location.state || {};

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  useEffect(() => {
    socket = io("https://chat-web-server-m5kkr1dcw-anshumisras-projects.vercel.app", {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on("connect", () => {
      setSocketId(socket.id);
      setConnectionStatus("connected");
      console.log("connected", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.log("Connection error:", error);
      setConnectionStatus("error");
    });

    socket.on("receive-message", (data) => {
      if (data.username !== userName) {
        setMessages((prevMessages) => [...prevMessages, { text: data.message, isUser: false, username: data.username }]);
      }
      console.log(data);
    });

    socket.on("room-joined", (roomName) => {
      setRoom(roomName);
      setMessages([]);
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket.off();
      }
    };
  }, [userName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage = { text: message, isUser: true, username: userName || 'Guest' };
    socket.emit('message', { room, message, username: userName || 'Guest' });
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    
    socket.emit('join-room', { room: roomName, username: userName || 'Guest' });
    setRoomName("");
  };

  return (
    <div>
      <div className="flex justify-around p-3 mb-2 border-b border-amber-200">
        <Link to={`/`}><ButtonCustom text={"Home"} /></Link>
        <div><img src={socketImage} className="w-12 h-12" alt="socket image" /></div>
      </div>
      <div className="flex flex-col items-center min-h-screen bg-stone-900 p-4">
        <div className='w-full max-w-4xl mb-6'>
          <div className='text-yellow-400 text-2xl font-bold mb-2'>
            Welcome, {userName || 'Guest'}!
            <span className={`ml-4 text-sm ${
              connectionStatus === "connected" ? "text-green-500" : "text-red-500"
            }`}>
              ({connectionStatus})
            </span>
          </div>
          <div className='flex justify-between items-center mb-4'>
            <form onSubmit={joinRoomHandler} className="flex items-center w-full">
              <input
                type="text"
                placeholder="Enter Room Name"
                className="flex-grow px-4 py-2 rounded-l-full bg-stone-900 border-t border-b border-l border-yellow-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                onChange={(e) => setRoomName(e.target.value)}
                value={roomName}
              />
              <button
                type="submit"
                className="px-6 py-2 rounded-r-full bg-yellow-500 text-gray-900 font-semibold transition-colors duration-300 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center"
              >
                <Users size={18} className="mr-2" />
                Join Room
              </button>
            </form>
          </div>
          <div className='flex justify-between items-center text-yellow-400 text-sm mb-1'>
            <div>Current Room: {room || 'None'}</div>
          </div>
        </div>
        
        <ChatBox 
          messages={messages}
          message={message}
          setMessage={setMessage}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default Chat;