const express = require("express");
const mongoose = require("mongoose");
const Item = require("./itemModel");

const app = express();

// Middleware
app.use(express.json());

// PORT
const PORT = process.env.PORT || 5000;

const MONGODB_URL =
  "mongodb+srv://chiamaka:chiamaka123@cluster0.nyho3na.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URL).then(() => {
  console.log("MongoDB connected successfully");
  app.listen(PORT, () => {
    console.log("Server started running");
  });
});




// Get all items
app.get("/all-items", async (req, res) => {
  const allItems = await Item.find();
  res.status(200).json({
    message: "Success",
    allItems,
  });
});





// add new item
app.post("/add-item", async (req, res) => {
  const { itemName, description, locationFound, dateFound, claimed } = req.body;

  if (!itemName || !description || !locationFound) {
    return res.status(400).json({
      message: "Please fill in all required fields",
    });
  }

  const newItem = new Item({
    itemName,
    description,
    locationFound,
    dateFound,
    claimed,
  });

  await newItem.save();

  res.status(201).json({
    message: "Item added successfully",
    newItem,
  });
});




// view unclaimed items
app.get("/unclaimed-items", async (req, res) => {
  const unclaimedItems = await Item.find({ claimed: false });
  res.status(200).json({
    message: "Success",
    unclaimedItems,
  });
});





// View one item by ID
app.get("/view-item/:id", async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);

  if (!item) {
    return res.status(404).json({
      message: "Item not found",
    });
  }

  res.status(200).json({
    message: "Success",
    item,
  });
});




// Update an item’s details or mark as claimed
app.put("/update-item/:id", async (req, res) => {
  const { id } = req.params;
  const { itemName, description, locationFound, dateFound, claimed } = req.body;

  const updatedItem = await Item.findByIdAndUpdate(
    id,
    {
      itemName,
      description,
      locationFound,
      dateFound,
      claimed,
    },
    { new: true }
  );

  if (!updatedItem) {
    return res.status(404).json({
      message: "Item not updated",
    });
  }

  res.status(200).json({
    message: "Item updated successfully",
    updatedItem,
  });
});


// Delete old/irrelevant entries
app.delete("/delete-item", async (req, res) => {
  const { id } = req.body;

  const deletedItem = await Item.findByIdAndDelete(id);

  res.status(200).json({
    message: "Item deleted successfully",
  });
});
