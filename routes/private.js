/*!
 * =============================================================================
 * Router for /private
 * =============================================================================
 */

// Import packages.
const fs      = require('fs');
const path    = require('path');
const router  = require('express').Router();

// Import authentication mechanisms.
const { checkAuth } = require('../passport.config');

// Get root directory.
const root = path.dirname(__dirname);

/*!
 * =============================================================================
 * GET
 * =============================================================================
 */

router.get('/images/foods/:file', checkAuth, (req, res, next) => {
    // Construct file path to private asset.
    const file = path.join(root, 'private', 'images', 'foods', req.params.file);
    
    // Check existence of file.
    // If it does, send it. Else, redirect to /erroré
    fs.access(file, (err) => { 
        if (err) {
            res.redirect('/error');
            return undefined;
        }

        res.sendFile(file);
    });
});

/*!
 * =============================================================================
 * Export router
 * =============================================================================
 */

module.exports = router;