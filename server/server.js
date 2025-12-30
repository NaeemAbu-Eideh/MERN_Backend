require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db.config");
const userRoutes = require("./routes/user.routes");
const tournamentRoutes = require("./routes/tournament.route")
const stadiumRoutes = require("./routes/stadium.route");
const teamRoutes = require("./routes/team.route");
const matchRoutes = require("./routes/match.route")
const geminiRoutes = require("./routes/ai.route");
const joinRequestsRoutes = require("./routes/joinRequest.route");

const chatSocket = require("./socket");
const chatRoutes = require("./routes/chat.route");

const { setupSocket } = require("./socket");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(userRoutes, tournamentRoutes, stadiumRoutes, teamRoutes, matchRoutes, joinRequestsRoutes, chatRoutes);
app.use("/api/ai", geminiRoutes);


connectDB(process.env.MONGO_URI);

const port = process.env.PORT;

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: process.env.CLIENT_ORIGIN, credentials: true },
});

chatSocket(io);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});