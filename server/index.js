import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

const port = process.env.PORT || 3000;
const app = express();
app.use(cors())

const server = createServer(app);
console.log("HIII")
const io = new Server(server, {
    cors: {
        origin: ["https://chat-web-client-two.vercel.app","https://chat-web-client-two.vercel.app/chat"],
        methods: ["GET", "POST","HEAD"],
        credentials: true,
        transports: ['websocket']
    },
});


app.get('/', (req, res) => {
    res.send('Server is running');
});

io.on("connection", (socket) => {
    console.log("user connected", socket.id)

    socket.on("message", ({ room, message="Join a room", username }) => {
        console.log(`Message in room ${room} from ${username}: ${message}`);
        if (room) {
            socket.to(room).emit("receive-message", { message, username });
        }
    });

    socket.on("join-room", ({ room, username }) => {
        socket.join(room);
        console.log(`User ${username} (${socket.id}) joined ${room}`);
        socket.emit('room-joined', room);
        
        socket.to(room).emit("receive-message", { message: `${username} has joined the room.`, username: "Server" });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected ", socket.id);
        socket.rooms.forEach(room => {
            if (room !== socket.id) {
                io.to(room).emit("receive-message", { message: `A user has left the room.`, username: "Server" });
            }
        });
    });
});

server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});