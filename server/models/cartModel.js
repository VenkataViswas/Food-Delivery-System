const mongoose = require("mongoose");

// Define the schema for the cart model
const OrderSchema = new mongoose.Schema({
  username: String,
  items: Array,
  totalBill: Number,
  orderDate: {
      type: Date,
      default: Date.now, // Automatically sets the order date
  },
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = {
  Order,
};
