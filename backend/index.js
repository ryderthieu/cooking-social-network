const express = require("express");
const cors = require("cors");
const db = require("./config/db");

// Load env
require("dotenv").config();

// Init express
const app = express();
const PORT = process.env.PORT;

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

// Start server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
