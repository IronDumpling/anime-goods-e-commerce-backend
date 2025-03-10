const express = require("express");
const router = express.Router();
const userRoutes = require("./routes/users");

router.use("/user", userRoutes);

module.exports = router;
