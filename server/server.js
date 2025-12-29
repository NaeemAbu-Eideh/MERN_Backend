require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db.config");
const userRoutes = require("./routes/user.routes");
const tournamentRoutes = require("./routes/tournament.route")
const stadiumRoutes = require("./routes/stadium.route");
const teamRoutes = require("./routes/team.route");
const matchRoutes = require("./routes/match.route")
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(userRoutes, tournamentRoutes, stadiumRoutes, teamRoutes, matchRoutes);

connectDB(process.env.MONGO_URI);

const port = process.env.PORT;

app.listen(
    port,
    () => {
        console.log(`Server running on port ${port}`)
    }
);