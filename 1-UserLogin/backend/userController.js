// userController.js
import bcrypt from "bcryptjs";
import { query } from "./userModel.js"; // Import the query function

const SALT_WORK_FACTOR = 10;

const userController = {};

// Middleware for signing up a new user
userController.signUp = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_WORK_FACTOR);
    const result = await query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );
    res.locals.userId = result.rows[0].id;
    // Set user data in locals for response
    res.locals.user = {
      id: result.rows[0].id,
      username: result.rows[0].username,
    };
    console.log('USER SIGNED UP');
    return next();
  } catch (err) {
    return next({
      log: "Error in userController.signUp middleware",
      status: 400,
      message: { err: "Failed to create user" },
    });
  }
};

// Middleware for logging in a user
userController.logIn = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const result = await query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    // Set user data in locals for response
    res.locals.user = {
      id: user.id,
      username: user.username,
    };

    return next();
  } catch (err) {
    return next({
      log: "Error in userController.logIn middleware",
      status: 500,
      message: { err: "Failed to log in user" },
    });
  }
};

// Middleware for handling successful operations
userController.success = (req, res) => {
  res.status(200).json({
    message: "Operation successful",
    user: res.locals.user, // Return user data
  });
};

export default userController;
