const express = require('express')
const path = require('path')
const Handlebars = require("handlebars")
const exphbs = require('express-handlebars')
const methodOverride = require ('method-override')
const session = require('express-session')
const flash = require("connect-flash")
const passport= require("passport")
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

//initializations 
const app = express()
require('./database') 
require('./config/passport')
// settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir:path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', '.hbs')

//middlewares
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'mysecretapp',
    resave: true,
   saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


//routes
app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))

//globales variables
app.use((req, res, next) =>{

    app.locals.suc = req.flash("suc")
    app.locals.error = req.flash("error")
    app.locals.user = req.user || null

    next()
})

//static files
app.use(express.static(path.join(__dirname, 'public')))


// server listening 
app.listen(app.get('port'), () =>{
    console.log('server on port' + app.get('port'))
})

