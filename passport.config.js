/*!
 * =============================================================================
 * Configure a Passport strategy
 * =============================================================================
 */

// Import packages.
const bcrypt        = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

// Import users.
// There is no sign-up mechansism to push new users to this array.
const users = require('./crypt/users');

/*!
 * =============================================================================
 * Identification mechanisms
 * =============================================================================
 */

/**
 * Find a user by its username in an array of users.
 * 
 * @param {string} username - A username.
 */
 const getUser = username => users.find(user => user.username === username);

/**
 * Find a user by its internal ID in an array of users.
 *
 * @param {string} id - An internal ID.
 */
const getUserById = id => users.find(user => user.id === id);

/*!
 * =============================================================================
 * Authentication mechanisms
 * =============================================================================
 */

/**
 * Passport's verify done callback.
 *
 * @callback verifyCallback
 * @param {(Error|undefined)} err    - Possible error.
 * @param {(Object|boolean)}  user   - Verified user or false if not allowed.
 * @param {Object}            [info] - Additional info message for flash messages.
 * @returns {undefined} The verify callback is an internal mechanism of Passport
 *     that returns nothing. Depending on what's passed to the callback, it
 *     will call one of its own methods: either error(), success() or fail().
 */

/**
 * Authenticate users by validating their credentials.
 * 
 * @param {string}         username - A user's username.
 * @param {string}         password - A users's password.
 * @param {verifyCallback} done     - Passport's verify callback.
 * @returns {undefined}
 */
const authenticateUser = async (username, password, done) => {
    // Get user from its username.
    const user = getUser(username);
    
    // If no used is found.
    if (user === undefined) {
        // Call verify callback with user = false.
        // This signature indicates that username
        // does not exist and is not allowed.
        return done(null, false);
    }

    // Wrap authentication process in a try-catch
    // loop. This process is asynchronous because
    // of bcrypt, thus we need to do so to catch
    // errors.
    try {
        // Compare supplied password to user's true password.
        if (await bcrypt.compare(password, user.password)) {
            // If it matches, call verify callback with
            // the authenticated user. This signature
            // indicates that user is granted access.
            return done(null, user);
        } else {
            // If it does not match, call verify callback
            // with user = false. This signature indicates
            // that username is not allowed, because it
            // passed a wrong password.
            return done(null, false);
        }
    } catch (e) {
        // On any error during the process, call verify
        // callback with the underlying error. This
        // signature indicates that something wrong
        // happened.
        return done(e);
    }
}

/**
 * Check if a user is already authenticated.
 * 
 * @param {Object}   req  - A Request object.
 * @param {Object}   res  - A Response object.
 * @param {Function} next - A Express middleware function.
 */
const checkAuth = (req, res, next) => {
    // Check if user is authenticated already.
    if (req.isAuthenticated()) {
        // If so, call the next middleware
        // function. If there is none, then
        // this leads to the next route callback.
        return next();
    }

    // Else, user is not authenticated.
    // Redirect him to the login page.
    return res.redirect('/login');
}

/**
 * Check if a user is not already authenticated.
 * 
 * @param {Object}   req  - A Request object.
 * @param {Object}   res  - A Response object.
 * @param {Function} next - An Express middleware function.
 */
const checkNotAuth = (req, res, next) => {
    // Check if user is authenticated already.
    if (req.isAuthenticated()) {
        // If so, then redirect user
        // to the dashboard route. There
        // is nothing else to do.
        return res.redirect('/dashboard');
    }

    // If not, call the next middleware
    // function. If there is none, then
    // this leads to the login route callback.
    // User must be authenticated.
    next();
}

/*!
 * =============================================================================
 * User serialization / deserialization mechanisms
 * =============================================================================
 */

/**
 * Serialize a user (User => ID).
 * 
 * @param {object} user - A user.
 * @param {string} user.id - A user's internal ID.
 * @param {string} user.username - A user's username.  
 * @param {string} user.password - A user's password.  
 * @param {verifyCallback} done  - Passport's verify callback.
 * @returns {undefined}
 */
const userSerializer = (user, done) => done(null, user.id);

/**
 * Deserialize a user (ID => User).
 * 
 * @param {string}         id   - A user's internal ID. 
 * @param {verifyCallback} done - Passport's verify callback.
 * @returns {undefined}
 */
const userDeserializer = (id, done) => done(null, getUserById(id));

/*!
 * =============================================================================
 * Initialization mechanism
 * =============================================================================
 */

/**
 * A function that initializes a proper Local Strategy for Passport.
 * 
 * @param {Authenticator} passport - an object returned when loading passport. 
 * @returns {undefined} This function is used for its side-effect of
 *     mutating an existing Authenticator (Passport) object.
 */
const initPassport = passport => {
    // Construct a new LocalStrategy.
    // Pass the authentication function
    // to it. This is our login mechanism.
    localStrat = new LocalStrategy({ 
            usernameField: 'username', 
            passwordField: 'password' 
        },
        authenticateUser);
    
    // Use our local strategy.
    passport.use(localStrat);

    // Use our serialization and deserialization mechanisms. 
    passport.serializeUser(userSerializer);
    passport.deserializeUser(userDeserializer);
}

/*!
 * =============================================================================
 * Export mechanisms
 * =============================================================================
 */

module.exports = { initPassport, checkAuth, checkNotAuth };
