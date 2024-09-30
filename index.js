// const express = require("express");
// const { connection } = require("./config/db");
// const cors = require("cors");
// const AllRoutes = require("./Routes/AllRoutes");

// require("dotenv").config();
// const port = process.env.PORT || 7500;
// const app = express();
// app.use(cors(), express.json());

// app.use("/", AllRoutes);

// app.listen(port, async () => {
//   try {
//     await connection;
//     console.log(`listening on port ${port}`);
//     console.log("Connected to DB Success");
//   } catch (err) {
//     console.log("Failed to connect to DB");
//   }
// });

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const generalConfigs = require("./config/general-config");
const connectDB = require("./config/db");
const AllRoutes = require("./Routes/AllRoutes");

const initializeServer = async (port) => {
  try {
    await connectDB();
    console.log("'Database connected successfully.");
    const server = express();

    // CORS configuration
    server.use(cors());

    // Body parsers
    server.use(express.urlencoded({ extended: true, limit: "10mb" })); // Adjust limit as needed
    server.use(express.json({ limit: "10mb" })); // Adjust limit as needed
    server.use(express.text({ type: "*/xml" }));

    server.use((req, res, next) => {
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
      );
      next(); // Pass control to the next middleware
    });
    // Route handlers
    server.use("/", AllRoutes);

    // Error handling middleware
    server.use((err, req, res, next) => {
      console.log("Unhandled error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });

    // Start server
    server.listen(port, () =>
      console.log(`Server instance listening @port: ${port}`)
    );

    return server;
  } catch (err) {
    console.log(err);
    process.exit(1); // Exit with failure code
  }
};

// Initialize server with configuration
module.exports = initializeServer(generalConfigs.serverPort || 3002);
