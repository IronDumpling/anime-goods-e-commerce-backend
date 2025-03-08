const express = require("express");
const router = express.Router();
const db = require("../database");

// POST /api/user
// Create user
router.post("/", async (req, res, next) => {
  try {
      const { firstName, lastName, email, address, isAdmin } = req.body;
      const user = await db.createUser({ firstName, lastName, email, address, isAdmin });
      res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// GET /api/user/allCustomers
// Get all customers
router.get(
  "/allCustomers",
  async (req, res, next) => {
    try {
      const all_customers = await db.getAllCustomers();
      res.status(200).json(all_customers);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/user/:email
// Find user by email
router.get("/:email", async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    next(error);
  }
});



module.exports = router;
