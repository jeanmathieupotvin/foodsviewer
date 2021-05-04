/*!
 * =============================================================================
 * Express application's instantiation
 * =============================================================================
 */

// Import packages.
const express     = require('express');
const session     = require('express-session');
const path        = require('path');
const passport    = require('passport');
const MemoryStore = require('memorystore')(session);

// Import routes.
const indexRoute     = require('./routes/index');
const loginRoute     = require('./routes/login');
const logoutRoute    = require('./routes/logout');
const dashboardRoute = require('./routes/dashboard');
const privateRoute   = require('./routes/private');
const errorRoute     = require('./routes/error');

// Import Passport configuration.
const { initPassport } = require('./passport.config');

/*!
 * =============================================================================
 * Initialize Express application
 * =============================================================================
 */

const app = express();

/*!
 * =============================================================================
 * Initialize Passport strategy
 * =============================================================================
 */

// To salt/hash a password before storing it.
// require('bcrypt').hash('pass_to_hash_here', 10).then(r => console.log(r));

// Initialize Passport Strategy.
initPassport(passport);

/*!
 * =============================================================================
 * Define app's view engine (EJS)
 * =============================================================================
 */

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/*!
 * =============================================================================
 * Define app's static/public files location
 * =============================================================================
 */

app.use(express.static(path.join(__dirname, 'public')));

/*!
 * =============================================================================
 * Decode and parse URL queries
 * =============================================================================
 */

// Make sure we can access form's values
// inside body of (POST) Request instances.
app.use(express.urlencoded({ extended: false }));

/*!
 * =============================================================================
 * Sessions and cookies
 * =============================================================================
 */

// Set a maxAge validity of 1 hour.
// MemoryStore will be pruned at the same rate.
const maxAge = 1000 * 60 * 60; // milliseconds

// Set cookies' parameters.
const cookie = {
    httpOnly: true,
    secure: false,
    sameSite: true,
    maxAge: maxAge
};

// In production, app is usually hidden
// behind a proxy (such as NGINX) that
// handles HTTPS requests.
if (process.env.NODE_ENV === 'production') {
    
    // Trust the first ip address found in
    // the vector req.ips. This is equivalent
    // to trusting our proxy.
    app.set('trust proxy', 1);

    // Enforce secure cookies.
    cookie.secure = true;
}

// Set sessions and persistency mechanism.
// We use the improved MemoryStore of the
// memorystore package. Set environment 
// variable DEBUG=memorystore to debug.
app.use(session({
    cookie: cookie,
    name: 'connectSessionID',
    proxy: process.env.NODE_ENV === 'production',
    store: new MemoryStore({
        checkPeriod: maxAge // Pruning step interval.
    }),
    secret: process.env.SESSION_TOKEN,
    resave: false,
    saveUninitialized: false
}));

// Pass initialized Passport's strategy
// tp app, activate it, and use sessions.
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
