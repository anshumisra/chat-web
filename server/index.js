import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

const port = process.env.PORT || 3000;
const app = express();


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
}));

const server = createServer(app);

const io = new Server(server, {
    path: '/socket.io/',
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["*"]
    },
    transports: ['polling', 'websocket'],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000
});


app.get('/', (req, res) => {
    res.send('Server is running');
});

io.on("connection", (socket) => {
    console.log("user connected", socket.id);


    socket.emit('connection_ack', { status: 'connected', id: socket.id });

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
        
        socket.to(room).emit("receive-message", { 
            message: `${username} has joined the room.`, 
            username: "Server" 
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected ", socket.id);
        socket.rooms.forEach(room => {
            if (room !== socket.id) {
                io.to(room).emit("receive-message", { 
                    message: `A user has left the room.`, 
                    username: "Server" 
                });
            }
        });
    });

    socket.on("error", (error) => {
        console.error("Socket error:", error);
    });
});

server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});