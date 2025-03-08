const express = require("express");
const routes = require("./routes");
const middleware = require("./middleware");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(middleware.requestLogger);

// Routes
app.use("/api", routes);

// Error handling
app.use(middleware.errorHandler);

// Start the server only if this file is executed directly (not imported elsewhere)
// This prevents potential port conflicts during testing or when the file is used as a module
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
