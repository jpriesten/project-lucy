const mongoose = require("mongoose");
const validate = require("validator");
const Crypto = require("simple-crypto-js").default;

const crypto = new Crypto("out-of-the-box");

const ProductSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    productName: {
      required: true,
      type: String,
      trim: true
    },
    productCode: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    descr: {
      type: String,
      required: true,
      trim: true
    },
    manufacturerName: {
      type: String,
      required: true,
      trim: true
    },
    manufacturerAddress: {
      type: String,
      required: true,
      trim: true
    },
    dateCreated: {
      type: String,
      required: true,
      trim: true
    },
    expiryDate: {
      type: String,
      trim: true
    },
    photo: {
      type: String,
      trim: true
    },
    isVerified: {
      type: Boolean,
      default: false,
      trim: true
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now() + 60 * 60 * 1000)
    }
  },
  {
    timestamps: true
  }
);

let defaultImage =
  "data:image/png;base64,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";

// Hash all sensitive data
ProductSchema.pre("save", function(next) {
  let product = this;
  //Todo: Prepare product for verification
  product.photo = defaultImage;
  console.log(product);
  return next();
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
