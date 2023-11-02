const express= require('express');
const path = require ('path');
const mongoose= require('mongoose');
const ejsMate= require('ejs-mate');
const catchAsync= require('./utils/catchAsync');
const ExpressError= require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');
const { error } = require('console');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get ('/',(req,res) => {
    res.redirect('/campgrounds');
});

app.use ('/campgrounds', campgrounds);
app.use ('/campgrounds/:id/reviews', reviews);


app.all('*',(req,res,next)=>
    next(new ExpressError('Page not found', 404))
);

app.use((err,req,res,next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', {err});   
});


app.listen(3000, ()=>{
    console.log('Serving port 3000')
});