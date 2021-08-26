require("dotenv").config();
const conncetDB = require("./db/connect");
const Product = require("./models/product");
const jsonProduct = require("./products.json");

const start = async (req, res) => {
  try {
    await conncetDB(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.create(jsonProduct);
    console.log("Data persisted !!");
  } catch (error) {
    console.log(error);
  }
};

start();
