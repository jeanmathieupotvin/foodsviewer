/*!
 * =============================================================================
 * Router for /dashboard
 * =============================================================================
 */

// Import packages.
const router = require('express').Router();
const digest = require('../lib/digest')('Jm', 'Ren');

// Import authentication mechanisms.
const { checkAuth } = require('../passport.config');

// Extract route's metadata.
const version       = require('../package').version;
const digestVersion = require('../lib/digest/package').version;

// Import all users' IDs.
const userIds = require('../crypt/users').map(e => e.id);

/*!
 * =============================================================================
 * Load FoodCollection(s) into memory
 * =============================================================================
 */

// We create an object into which all users'
// FoodCollections are loaded. Keys of that
// object match users' IDs.
const foodCollections = {};

// Load all FoodCollection instances into
// FoodCollections. If you have more users
// you should consider loading the data on
// the fly asynchronously and move that
// operation in the router. You could also
// consider user a safe key-value store.
userIds.forEach(e => { 
  foodCollections[e] = new digest.FoodCollection(require(`../crypt/${e}`));
});

/*!
 * =============================================================================
 * GET
 * =============================================================================
 */

router.get('/', checkAuth, (req, res, next) => {
  // Construct a FoodQuery object from request's
  // query property. This object sanitizes users'
  // requests.
  const foodQuery = new digest.FoodQuery(req.query);

  // Get user ID from request.
  const userId = req.user.id;

  // Render the results' page.
  // This is based on (1) the FoodQuery instance and
  // (2) a call to method foodCollection.digest(). This 
  // method handles the request and returned a digested
  // FoodCollection instance. This collection is rendered
  // as a regular HTML table.
  res.render('dashboard', {
    javascript: '/javascripts/dashboard.js',
    stylesheet: '/stylesheets/dashboard.css',
    version: version,
    digestVersion: digestVersion,
    search: foodQuery.search,
    foods: foodCollections[userId].digest(foodQuery)
  });
});

/*!
 * =============================================================================
 * Export router
 * =============================================================================
 */

module.exports = router;