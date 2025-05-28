const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const socketServer = require('./socket')
const http = require('http')
// Load env
require("dotenv").config();

// Init express
const app = express();
const PORT = process.env.PORT;
const server = http.createServer(app)

// Socket
socketServer(server)

// Connect DB
db.connect();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/posts", require("./routes/postRoute"));
app.use("/api/videos", require("./routes/videoRoute"));
app.use("/api/ingredients", require("./routes/ingredientRoute"));
app.use("/api/recipes", require("./routes/recipeRoute"));
app.use("/api/comments", require("./routes/commentRoute"))
app.use("/api/messages", require("./routes/messageRoute"))
app.use("/api/conversations", require("./routes/conversationRoute"))
app.use("/api/notifications", require('./routes/notificationRoute'))
// Start server
server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
