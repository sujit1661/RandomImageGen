// Import core modules
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import pool from "./db.js"; // PostgreSQL pool

// Load environment variables from .env
dotenv.config();

// Initialize express app
const app = express();
const port = 3000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser (for login form — optional)
app.use(express.urlencoded({ extended: true }));

// Session middleware to keep user logged in
app.use(session({
  secret: process.env.SESSION_SECRET, // from .env
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport for auth
app.use(passport.initialize());
app.use(passport.session());

/* ------------ GOOGLE OAUTH STRATEGY ------------ */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,           // from .env
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,   // from .env
  callbackURL: "/auth/google/callback",             // must match Google Console
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  const name = profile.displayName;

  try {
    // Save user to PostgreSQL if not already exists
    await pool.query(
      "INSERT INTO users (email, name) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING",
      [email, name]
    );
    done(null, profile); // success
  } catch (err) {
    done(err, null); // error
  }
}));

// Store entire user object in session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

/* -------------------- ROUTES -------------------- */

// Home: show dashboard if logged in, else redirect to login
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    const name = req.user.displayName;
    const email = req.user.emails[0].value;
    // Redirect with name & email as query params
    res.redirect(`/dashboard?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
  } else {
    res.redirect("/login");
  }
});

// Login page (static file)
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Start Google login flow
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback route after Google login
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/") // redirect to home
);

// Serve dashboard.html (static)
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

// Logout user and redirect
app.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) console.error(err);
    res.redirect("/login");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
