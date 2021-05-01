/*!
 * =============================================================================
 * Router for /login
 * =============================================================================
 */

// Extract route's metadata.
const version       = require('../package').version;
const digestVersion = require('../lib/digest/package.json').version;

// Import packages.
const router   = require('express').Router();
const passport = require('passport');

// Import authentication mechanisms.
const { checkNotAuth } = require('../passport.config');

/*!
 * =============================================================================
 * GET
 * =============================================================================
 */

router.get('/', checkNotAuth, (req, res, next) => {
  res.render('login/login', {
    javascript: undefined,
    stylesheet: '/stylesheets/login.css',
    digestVersion: digestVersion,
    version: version 
  });
});

router.get('/failure', checkNotAuth, (req, res, next) => {
  res.render('login/failure', {
    javascript: undefined,
    stylesheet: '/stylesheets/login.css',
    version: version,
    digestVersion: digestVersion
  });
});

/*!
 * =============================================================================
 * POST
 * =============================================================================
 */

router.post('/', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login/failure'
}));

/*!
 * =============================================================================
 * Export router
 * =============================================================================
 */

module.exports = router;