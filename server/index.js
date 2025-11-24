const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/users");
const { Order } = require("./models/cartModel");
const session = require("express-session");
const app = express();

app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "yourSecretKey", // A secret key to sign the session ID cookie
    resave: false, // If false, session won't be saved if unmodified
    saveUninitialized: false, // If false, uninitialized sessions won't be saved
    cookie: { secure: false }, // Set true for HTTPS; use 'false' for local development
  })
);
mongoose.connect("mongodb://0.0.0.0:27017/AgileDB");

app.post("/register", (req, res) => {
  UserModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

app.post("/rate-item", async (req, res) => {
  const { itemName, rating } = req.body;

  try {
    const item = await Item.findOne({ item_name: itemName });

    if (!item) {
      return res.status(404).json("No record existed");
    }

    const newRating = (item.item_rating + rating) / 2;
    item.item_rating = newRating;
    await item.save();

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  UserModel.findOne({ username: username }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json("Success");
      } else {
        res.json("the password is incorrect");
      }
    } else {
      res.json("no record existed");
    }
  });
});

app.get("/logout", (req, res) => {
  // Clear the session or any authentication tokens
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    res.status(200).json({ message: "Logged out successfully" });
  });
});

const itemSchema = new mongoose.Schema({
  item_name: String,
  item_price: Number,
  item_description: String,
  item_image: String,
  item_rating: { type: Number, default: 5 },
});
const Item = mongoose.model("items", itemSchema);

// Define route to get items
app.get("/menu", async (req, res) => {
  try {
    const items = await Item.find();
    console.log(items)
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/changepassword", async (req, res) => {
  const u = req.body.username;
  const op = req.body.oldpassword;
  const np = req.body.newpassword;

  const udata = await UserModel.findOne({ username: u })
  if (udata.password === op) {
    UserModel.updateOne({ username: u }, { $set: { password: np } });
    res.json("Success");
  }
  else{
    res.json("Error")
  }
});


// app.post("/cart/checkout", async (req, res, next) => {
//     const { cartItems, totalBill } = req.body;

//     try {
//         const formattedCartItems = formatCartItems(cartItems);
//         console.log(formattedCartItems)
//         req.session.order = formattedCartItems;
//         req.session.bill = totalBill// Corrected function call

//         //   const newCart = new Cart({
//         //     cartItems: formattedCartItems, // Use the formatted string
//         //     totalBill,
//         //   });

//         //   await newCart.save(); // Save the data to MongoDB

//         res.status(200).json({ message: "Cart data saved successfully!" });
//         next();
//     } catch (error) {
//         console.error("Error saving cart data:", error);
//         res.status(500).json({ message: "Error saving cart data" });
//     }
// });
// const OrderSchema = new mongoose.Schema({
//     username: String,
//     items: Array,
//     totalBill: Number,
//     orderDate: {
//         type: Date,
//         default: Date.now, // Automatically sets the order date
//     },
// });

// const Order = mongoose.model('Order', OrderSchema);
app.post("/menu", async (req, res) => {
  try {
    const newItemData = {
      item_name: req.body.item_name,
      item_price: req.body.item_price,
      item_description: req.body.item_description,
      item_image: req.body.item_image,
      item_rating: req.body.item_rating || 5,
      category: req.body.category || "Main Course"
    };
    const newItem = await Item.create(newItemData);
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
});

// ROUTE: Delete a menu item by id (matching your frontend DELETE)
app.delete("/menu/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted successfully", item: deleted });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});
// Endpoint to handle cart checkout
app.post("/cart/checkout", (req, res) => {
  const { username, items, totalBill } = req.body;

  if (!username || !items || !totalBill) {
    return res.status(400).send("Missing required fields");
  }

  const newOrder = new Order({ username, items, totalBill });

  newOrder
    .save()
    .then((order) => res.status(201).json(order))
    .catch((err) => res.status(500).json({ error: "Internal server error" }));
});

// Endpoint to fetch order history by username
app.get("/history/:username", (req, res) => {
  const { username } = req.params;
  Order.find({ username: username })
    .then((orders) => res.json(orders))
    .catch((err) => res.status(500).json({ error: "Internal server error" }));
});

// Endpoint to update item rating

app.listen(3001, () => {
  console.log("server is running");
});
