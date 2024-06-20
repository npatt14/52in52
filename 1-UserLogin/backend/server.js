import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // necessary to be able to use dirname__, not supported on the one were using 
import userController from "./userController.js";

// Create __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // Initialize an Express application
const PORT = 5001; // Define the port the server will listen on

app.use(cors()); // Enable CORS middleware
app.use(express.json()); // Parse incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads
app.use(express.static(path.resolve(__dirname, "../frontend"))); // Serve static data from frontend

app.get("/",  (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/index.html"));
});


app.get("/signup", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/signup.html"));
});


// Route for user signup; applies signUp middleware and then success middleware
app.post("/signup", userController.signUp, (req, res) => {
  res.redirect("/success");
}); 

// Route for user login; applies logIn middleware and then success middleware
app.post("/login", userController.logIn, (req, res) => {
  res.redirect("/success");
});

app.get("/success", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/success.html"));
});

// Catch-all handler for undefined routes; returns 404 status
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

// Error handling middleware; logs error and sends response
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});