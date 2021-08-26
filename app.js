require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const productRouter = require("./routes/products");
app.use(express.json());

app.get("/", (req, res) => {
  res.send('<h1>Products API</h1><a href="/api/v1/products">Products list</a>');
});

app.use("/api/v1/products", productRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, (req, res) => {
      console.log("Server is running on port : ", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
