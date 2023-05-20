const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error");
const dotenv = require("dotenv");
const app = express();

dotenv.config({ path: "./config/config.env" });

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    credentials: true,
  })
);

app.get("/", (req, res, next) => res.json({ anc: "abc" }));

const userRoute = require("./routes/userRoute");



app.use("/api/user", userRoute);

app.all('*', async (req, res) => {
  res.status(404).json({error:{message:"Not Found. Kindly Check the API path as well as request type"}})
});
app.use(errorMiddleware);

module.exports = app;
