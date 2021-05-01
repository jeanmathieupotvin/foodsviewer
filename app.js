/*!
 * =============================================================================
 * Express application's instantiation
 * =============================================================================
 */

// Import packages.
const express  = require('express');
const session  = require('express-session');
const path     = require('path');
const passport = require('passport');

// Import routes.
const indexRoute     = require('./routes/index');
const loginRoute     = require('./routes/login');
const logoutRoute    = require('./routes/logout');
const dashboardRoute = require('./routes/dashboard');
const privateRoute   = require('./routes/private');
const errorRoute     = require('./routes/error');

// Import Passport configuration.
const { initPassport } = require('./passport.config');

// Instantiate a new Express application.
const app = express();

/*!
 * =============================================================================
 * Initialize Passport strategy
 * =============================================================================
 */

// To salt/hash a password before storing it.
// require('bcrypt').hash('ipass_to_hash_here', 10).then(r => console.log(r));

// Initialize Passport Strategy.
initPassport(passport);

/*!
 * =============================================================================
 * Define app's general parameters
 * =============================================================================
 */

// Set view engine setup.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set static files location.
app.use(express.static(path.join(__dirname, 'public')));

// Make sure we can access form's values
// inside body of (POST) Request instances.
app.use(express.urlencoded({ extended: false }));

// Set sessions and persistency mechanism.
app.use(session({
    secret: process.env.SESSION_TOKEN,
    httpOnly: true,
    secure: true,
    sameSite: true,
    maxAge: 600000,  // miliseconds (10 minutes)
    resave: false,
    saveUninitialized: false
}));

// Set authentication parameters.
app.use(passport.initialize());
app.use(passport.session());

/*!
 * =============================================================================
 * Load routes into app
 * =============================================================================
 */

app.use('/',          indexRoute);
app.use('/login',     loginRoute);
app.use('/logout',    logoutRoute);
app.use('/private',   privateRoute);   // 'Private' folder for static assets.
app.use('/dashboard', dashboardRoute);
app.use('*',          errorRoute);

/*!
 * =============================================================================
 * Export app
 * =============================================================================
 */

module.exports = app;
