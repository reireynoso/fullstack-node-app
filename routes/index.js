// main route

const express = require('express')
const router = express.Router()
const {ensureAuth,ensureGuest} = require('../middleware/auth')

const Story = require('../models/Story')

// @desc Login/Landing Page
// @route GET /
router.get('/', ensureGuest ,(req,res) => {
    res.render('login', {
        layout: 'login' // pass a second arg to tell which layout the view to use
    }) // res.render looks for the filename input under views directory
})

// @desc Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async(req,res) => {
    try {
        const stories = await Story.find({user: req.user.id}).lean(); // in order to pass data to a handlebars template  and render it while looping, lean() will help and turns into a POJO.
        res.render('dashboard', {
            name: req.user.firstName,
            stories: stories
        })

    } catch (error) {
        console.log.error(err)   
        res.render('error/500')     
    }
})

module.exports = router