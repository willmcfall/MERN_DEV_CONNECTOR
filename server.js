const express = require("express");

const connectDB = require("./config/db");

const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

app.get("/", function(req, res) {
  res.send("API running");
});

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profiles", require("./routes/api/profiles"));
app.use("/api/posts", require("./routes/api/posts"));

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});
