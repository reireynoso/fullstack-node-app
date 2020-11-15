// main route

const express = require('express')
const router = express.Router()

// @desc Login/Landing Page
// @route GET /
router.get('/', (req,res) => {
    res.render('login', {
        layout: 'login' // pass a second arg to tell which layout the view to use
    }) // res.render looks for the filename input under views directory
})

// @desc Dashboard
// @route GET /dashboard
router.get('/dashboard', (req,res) => {
    res.render('dashboard')
})

module.exports = router