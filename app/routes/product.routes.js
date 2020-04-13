module.exports = app => {
  const products = require("../controllers/product.controller");
  const authenticate = require("../middlewares/authenticator.middleware");

   // Create a new product
   app.post("/products/new", authenticate, products.newProduct);

   // Retrieve all products by User
   app.get("/products/me", authenticate, products.getProductsByUser);
 
   // Retrieve all products
   app.get("/products", products.getAllProducts);

   // Retrieve a product by product code
   app.get("/product", products.getProductByCode);

   // Delete a product
   app.delete("/product", authenticate, products.deleteProduct);
};
