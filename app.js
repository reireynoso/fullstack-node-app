const path = require('path')
const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db');

// load config
dotenv.config({path: './config/config.env'}) // where the global var files are located

// passport config
require('./config/passport')(passport)
// connect to the db
connectDB()

//intialize app
const app = express()
// body parser middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json())

if(process.env.NODE_ENV === "development"){ // only want to run in dev mode
    app.use(morgan('dev')) // when there's a request to the page of any kind, is shows down in the console
}

// handlebards helpers
const {formatDate, stripTags, truncate} = require('./helpers/hbs')

// handlebars
app.engine('.hbs', exphbs({helpers: {
    formatDate,
    stripTags,
    truncate
}, defaultLayout:'main',extname: '.hbs'})); // setting up to replace using .handlebars extension to take in .hbs
app.set('view engine', '.hbs');

// sessions
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false, // don't create a session until something is stored
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// static folder
app.use(express.static(path.join(__dirname, 'public'))) // provide the path where teh static folder is located

// Routes
app.use('/', require('./routes/index')) // anything that's just slash, link to the index.js under routes directory
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server is running on ${process.env.NODE_ENV} mode on port ${PORT}`))