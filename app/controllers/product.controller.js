const Product = require("../models/product.model");

// Create a new product
exports.newProduct = (req, res) => {
  // Get user information from request
  let product = new Product(req.body);
  product.userID = req.user._id;

  Product.init()
    .then(async () => {
      try {
        await product.save();
        res.status(201).send({ error: false, result: product });
      } catch (error) {
        console.log(product, error);
        res.status(400).send({ error: true, result: error.message });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(400).send({ error: true, result: error.message });
    });
};

exports.getProductsByUser = async (req, res) => {
    console.log("userID: ", req.user._id);
    try {
        const products = await Product.find({userID: req.user._id});
        res.status(201).send({"error": false, "result": products});
    } catch (error) {
        console.log("Errors", error);
        res.status(401).send({error: true, code: 13589, results: 'Can\'t get Product Details',
         message: error.message});
    }
}

exports.getProductByCode = async (req, res) => {
  console.log("Request: ", req.query);
  try {
      const products = await Product.find({productCode: req.query.productCode});
      res.status(201).send({"error": false, "result": products});
  } catch (error) {
      console.log("Errors", error);
      res.status(401).send({error: true, code: 13589, results: 'Can\'t get Product Details',
       message: error.message});
  }
}

exports.getAllProducts = async (req, res) => {
  try {
      const products = await Product.find();
      res.status(201).send({"error": false, "result": products});
  } catch (error) {
      console.log("Errors", error);
      res.status(401).send({error: true, code: 13590, results: 'Can\'t get Product Details',
       message: error.message});
  }
}

exports.deleteProduct = async (req, res) => {
    try {
        const productCode = req.body.productCode;
        let deleteResult = await Product.findOneAndDelete({productCode: productCode});
        console.log(deleteResult);
        res.status(201).send({"error": false, "result": deleteResult});
    } catch (error) {
        console.log("Errors", error);
        res.status(401).send({error: true, code: 13591, results: 'Can\'t delete Product',
         message: error.message});
    }
}
