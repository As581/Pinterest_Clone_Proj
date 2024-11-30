require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const User = require("../models/user.model");
const expressSession = require("express-session");
const connectDB = require("../utils/db");
const passport = require("passport");
const GoogleStrategy = require("../config/GoogleStrategy");
const flash = require("connect-flash");
const rateLimit = require("express-rate-limit");
const usersRouter = require("../routes/user.routes");
const postsRouter = require("../routes/posts.routes");
const boardRouter = require("../routes/board.routes");
const commentRouter = require("../routes/comment.route");
const authRouter = require("../routes/auth.routes.js");

const app = express();

// Connect to the database
connectDB();

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
});
app.use(limiter);

// View Engine Setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

// Express Session
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "hh", // Hardcoded session secret
  })
);

// Flash middleware
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser((user, done) => {
  done(null, user._id); // Store the user ID in the session
});
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/", usersRouter);
app.use("/posts", postsRouter);
app.use("/board", boardRouter);
app.use("/comments", commentRouter);
app.use("/auth", authRouter);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the application! Please navigate to the correct route.");
});

// Fallback for 404 errors
app.use((req, res, next) => {
  res.status(404).send("Sorry, the route does not exist.");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send({
    message: err.message || "Internal Server Error",
    error: {}, // Stack trace hidden
  });
});

// Start the server
const PORT = 4002; // Hardcoded port value
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
