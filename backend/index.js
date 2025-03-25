require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;

const express = require("express");
const db = require("./config/db");

const app = express();

db.connect();
app.use(express.json());
app.use(cors());
app.use("/api/posts", require("./routes/postRoute"));
app.use("/api/videos", require("./routes/videoRoute"));

app.listen(PORT, () => console.log(`App listening ${PORT}`));
