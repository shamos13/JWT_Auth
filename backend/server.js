const express = require("express");
require("dotenv").config();
const app = express();
//const cors = require("cors");
const pool = require("./db")
// MiddleWare
app.use(express.json());
//app.use(cors);

// Routes

// Register and Login routes

app.use("/auth",require("./routes/jwatAuth"))

// Testing the DB connection
app.get("/test",async (req,res) => {
    const getUsers = await pool.query("SELECT * FROM users");
    res.status(200).json({
        message: "Database Connected Successfully",
        data : getUsers.rows
    });
})
app.get('/api', (req, res) => {
  console.log('Hit the API');
  res.send('Hello from the API');
});
app.listen(3002,()=>{
    console.log("Running on port 3002")}
);

