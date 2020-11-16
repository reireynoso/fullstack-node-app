const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')

const Story = require('../models/Story')

// @desc Show add page
// @route GET /stories/add
router.get('/add', ensureAuth ,(req,res) => {
    res.render('stories/add') // res.render looks for the filename input under views directory
})

// @desc Index Page stories page
// @route GET /
router.get('/', ensureAuth , async(req,res) => {
    try {  
        const stories = await Story.find({status: 'public'})
        .populate('user')
        .sort({createdAt: 'desc'})
        .lean()
        res.render('stories/index', {
            stories,
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

// @desc Process add form
// @route POST /stories
router.post('/', ensureAuth , async(req,res) => {
   try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
   } catch (error) {
       console.error(error)
       res.render('error/500')
   }
})

module.exports = router