# Database
- Setup MongoDB, noSQL database. Using Atlas, cloud storage database. Create a cluster if no clusers have been before or build a new project if the free cluster has already been set.
- Include user under `Database Access` with read/write permissions
- Under `Network Access`, add IP Address to allow access to the database. For now, only include current IP address
- Will require the connection string from `Connect` for the app to connect

# Intitialize Project Directory
- Create project directory. Open the directory and run `npm init -y` from the terminal.
## Install dependencies  
- `npm install express`, the web framework to create routes and other things. 
- `npm install mongoose` to work with our database models . 
- `npm install connect-mongo`, which allows us to store our sessions in our database so that when we reset the server, we don't get logged out. 
- `npm install express-session` for sessions and cookies. 
- `npm install express-handlebars` which is what we're using as template engine (alternatives are pug or ejs). 
- `npm install dotenv`, for handling config environment variables. 
- `npm install method-override`, allow us to make PUT and DELETE requests from our templates since by default we can only make GET and POST. 
- `npm install moment`, used to format dates. 
- `npm install morgan` for logging. 
- `npm install passport` for authentication. 
- `npm install passport-google-oauth20` since we;re using google for out login to work with passport
## Install devDependencies 
- `npm install -D nodemon`, continously watch the server so we don;t have to restart every time there's a change
- `npm install -D cross-env` for handling global variables within the scripts in package.json
## Start Scripts
- To handle the app when deployed in production: Set the `start` script to use `cross-env NODE_ENV=production node app` to set an env variable to explicitly set the node env to production followed by `node` to run the file which is going to be `app.js`
- To handle the app while its in devlopement, set up `dev` script and use `cross-env NODE_ENV=development nodemon app` with nodemon restarting the app automatically every time there's a change
## Create entry point
- In the root directory, create the `app.js` file which serves as the entry point. Inside the file, setup the express server as well as the dotenv
```js
const express = require('express');
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// load config
dotenv.config({path: './config/config.env'}) // where the global var files are located

// connect to the db
connectDB()

//intialize app
const app = express()

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server is running on ${process.env.NODE_ENV} mode on port ${PORT}`))
```
## Setup mongoose
- Create a `config` directory that will hold the env files and other config files. 
- Set up the db config by createing a file inside of `config`, `db.js`
```js
const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }) // for the second arg, can provide object to avoid warnigns
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }catch(e){
        console.log(error(err))
        process.exit(1) // end and exit out of program
    }
}

module.exports = connectDB
```
- Set up morgan to handle requests to the page of any kind in `app.js`
- setup handle bars configuration in `app.js`

# Views
- Create a views directory. Inside of it, create another directory, `layouts` to hold main layouts. Create `main.hbs`
- Directly under the views, create the views that will render if someone visits a route

# Routes
- Create a routes directory. Main `index.js` will include routes at the top most level. Routes will render based filename matching views directory. To require the route in the `app.js`:
```js
app.use('/', require('./routes/index')) // anything that's just slash, link to the index.js under routes directory
```

# Static Folder
- Create a directory, `public` which will contain the static files including css. Create a `css` directory

# Google Auth
- We'll need an API key and API secret from google console. Create new project.
- Navigate to `APIs & Services` -> `Enable APIs and Services` -> `Goggle Plus` -> `Enable` -> `Manage` -> `Credentials` -> `Credentials in APIs & Services` -> `Create Credentials` -> `OAuth client ID`. Set up `Authorized redirect URIs` (localhost for dev but something else for deployed) `http://localhost:3000/auth/google/callback` Once submitted, you get the Client ID and client Secret

# Passport
- Using the `passport-google-oauth20`
- Under `config`, create a `passport.js` file which will handle the strategy

# Lockdown routes
- Create a middleware directory and create a middleware file that detects if a user is logged in or not

# Store Session
- In app.js, require connect-mongo but passsing in the session. along with mongoose. Adjust the session middleware to include store

# Override PUT and DELETE
- In App.js
```js
const methodOverride = require("method-override")

app.use(methodOverride(function(req,res){
    if(req.body && typeof req.body === 'object' && '_method' in req.body){
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

// include in routes
// @desc Show edit page 
// @route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth , async(req,res) => {
    const story = await Story.findOne({
        _id: req.params.id
    }).lean()

    if(!story){
        return res.render('error/404')
    }

    if(story.user != req.user.id){
        res.redirect('/stories')
    }else{
        res.render('stories/edit', {
            story
        })
    }
 })

  // @desc Update story
// @route PUT /stories/:id
router.put('/:id', ensureAuth ,async(req,res) => {
    let story = await Story.findById(req.params.id).lean()

    if(!story){
        return res.render('error/404')
    }

    if(story.user != req.user.id){
        res.redirect('/stories')
    }else{
        story = await Story.findOneAndUpdate({_id: req.params.id}, req.body, {
            new: true,
            runValidators: true
        })

        res.redirect('/dashboard')
    }
})

router.delete('/:id', ensureAuth , async(req,res) => {
    try {
        await Story.remove({
            _id: req.params.id
        })

        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        return res.render('error/500')
    }
})

// include in HTML form
<input type="hidden" name="_method" value="PUT">
```