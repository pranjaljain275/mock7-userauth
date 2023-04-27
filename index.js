const express = require("express");
require("dotenv").config();
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const { connection } = require("./config/db");
const { userRoute } = require("./routes/user.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", userRoute);

app.get("/", (req, res) => {
  res.send("Welcome to Authentication App");
});

// Github Oauth

app.get("/auth/github", async (req,res)=>{
    const {code} = req.query;
    const response = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            client_id: process.env.client_id,
            client_secret: process.env.client_secret,
            code: code,
        })
    })

    const token = await response.json();
    console.log(token);

    const userData = await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access_token}`
        },
    })
    console.log(userData);
    res.send(userData);
})

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("DB Connection");
  } catch (err) {
    console.log("DB Not connected");
  }
  console.log(`Server is running on port ${process.env.port}`);
});
