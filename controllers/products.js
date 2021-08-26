const Product = require("../models/product");
const getAllProducts = async (req, res) => {
  try {
    const { featured, company, name, price, sort, fields, numericFilters } =
      req.query;
    const queryObject = {};
    //Filters
    if (featured) {
      queryObject.featured = featured === "true" ? true : false;
    }
    if (company) {
      queryObject.company = company;
    }
    if (name) {
      queryObject.name = { $regex: name, $options: "i" };
    }
    if (price) {
      queryObject.price = price;
    }

    //Numeric Filters
    if (numericFilters) {
      const operatorMap = {
        "<": "$lt",
        "<=": "$lte",
        "=": "$eq",
        ">": "$gt",
        ">=": "$gte",
      };
      const regEx = /\b(<|>|=|<=|>=)\b/g;
      let filters = numericFilters.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      );
      const options = ["rating", "price"];
      filters = filters.split(",").forEach((item) => {
        const [field, operator, value] = item.split("-");
        if (options.includes(field)) {
          queryObject[field] = { [operator]: Number(value) };
        }
      });
      console.log(queryObject);
    }
    // chain sort(), skip() /pagination/, select() /fields to show/
    let result = Product.find(queryObject);

    if (sort) {
      const sortList = sort.split(",").join(" ");
      result = result.sort(sortList);
    } else {
      //default sort
      result = result.sort("createdAt");
    }

    if (fields) {
      const fieldsList = fields.split(",").join(" ");
      result = result.select(fieldsList);
    }
    //pagination
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    //

    const allProducts = await result;

    if (!allProducts) {
      return res.status(404).send("No pructs to list");
    }
    res.status(200).json({ data: allProducts, nbrHits: allProducts.length });
  } catch (error) {
    console.log(error);
  }
};

const getAllProductsStatic = async (req, res) => {
  try {
    const allProducts = await Product.find({ name: "vase table" });
    if (!allProducts) {
      return res.status(404).send("No pructs to list");
    }
    res.status(200).json({ data: allProducts, nbrHits: allProducts.length });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getAllProducts, getAllProductsStatic };
