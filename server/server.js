require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db.config");
const userRoutes = require("./routes/user.routes");
const geminiRoutes = require("./routes/ai.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(userRoutes);
app.use("/api/ai", geminiRoutes);

connectDB(process.env.MONGO_URI);

const port = process.env.PORT || 3000;

app.listen(
    port,
    () => {
        console.log(`Server running on port ${port}`)
    }
);