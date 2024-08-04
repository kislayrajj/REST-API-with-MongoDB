const express = require("express");
const connectMongoDB = require("./connection");
const userRouter = require("./routes/user");
const { logReqRes } = require("./middlewares");

const app = express();
const PORT = 8000;

// connecting to mongoDB
connectMongoDB("mongodb://127.0.0.1:27017/firstMongo-db")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Error connecting to MongoDB" + err));

// middleware
app.use(express.urlencoded({ extended: false }));

// log every requests
app.use(logReqRes("log.txt"));

//Routes
app.get("/", (req, res) => {
  res.send("Server is running !");
});

app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log("Server is running on the port " + PORT);
});
